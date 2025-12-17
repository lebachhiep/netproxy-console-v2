import { Badge } from '@/components/badge/Badge';
import { Button } from '@/components/button/Button';
import IconButton from '@/components/button/IconButton';
import { BalanceCard } from '@/components/card/BalanceCard';
import { ArrowCounter, ContentCopy, MagnifyingGlass } from '@/components/icons';
import { Input } from '@/components/input/Input';
import { SectionTitle } from '@/components/SectionTitle';
import { Table, TableColumn } from '@/components/table/Table';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useResponsive } from '@/hooks/useResponsive';
import { toast } from 'sonner';
import { DateRangePicker } from '@/components/date-range-picker/DateRangePicker';
import { copyToClipboard } from '@/utils/copyToClipboard';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { itemVariants, pageVariants } from '@/utils/animation';
import { transactionService } from '@/services/transaction/transaction.service';
import { TransactionDisplay } from '@/services/transaction/transaction.types';
import { transformTransaction, formatDateForAPI } from '@/utils/transaction.utils';
import { walletService } from '@/services/wallet/wallet.service';
import { WalletBalance } from '@/services/wallet/wallet.types';
import { useAuth } from '@/hooks/useAuth';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/select/Select';
import { Slider } from '@/components/slider/Slider';
import { InputField } from '@/components/input/InputField';
import { useCryptomusPayment, usePaymentMethods, useTazapayPayment } from '@/hooks/usePayments';
import { BANK_INFO_MAPPING, BankInfo } from '@/utils/constants';
import TopUpModalV2 from './components/TopUpModalV2';
import CryptocurrencyIcon from '@/assets/images/crypto-currency.png';

const WalletPage: React.FC = () => {
  const { data: paymentMethods } = usePaymentMethods();
  const { t } = useTranslation();
  const pageTitle = usePageTitle({ pageName: 'Xem ví' });
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();
  const { userProfile, getDisplayName } = useAuth();
  const [priceValue, setPriceValue] = useState(10);
  const [selectedMethod, setSelectedMethod] = useState<string | number>('ACB');
  const { mutate: generateTazapayPayment, isPending: isTazapayPending } = useTazapayPayment();
  const { mutate: generateCryptomusPayment, isPending: isCryptomusPending } = useCryptomusPayment();

  // Top-up modal state
  const [topUpModalOpen, setTopUpModalOpen] = useState(false);
  const [topUpMethod, setTopUpMethod] = useState<'tazapay' | 'cryptomus' | 'web2m' | null>(null);
  const [tazapayCountry, setTazapayCountry] = useState<string>('');

  // Balance state
  const [balance, setBalance] = useState<WalletBalance | null>(null);

  // Transaction state
  const [transactions, setTransactions] = useState<TransactionDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  // payment method options

  const isTazapayAvailable = paymentMethods?.methods.find((m) => m.type === 'tazapay')?.available;
  const tazapayCountryOptions = isTazapayAvailable
    ? paymentMethods?.methods.find((m) => m.type === 'tazapay')?.supported_countries || []
    : [];
  const web2mMethod = paymentMethods?.methods.find((m) => m.type === 'web2m')?.bank_info || {
    bank_name: 'mbbank'
  };

  const web2mAvailable: BankInfo | undefined = Object.values(BANK_INFO_MAPPING).find(
    (bank) => bank.shortName.toLowerCase() === web2mMethod.bank_name.toLowerCase()
  );
  const options = [];
  if (web2mAvailable) {
    options.push({
      value: 'web2m',
      label: (
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center w-full">
            <div className="w-8 h-6 flex justify-center items-center">
              <img src={web2mAvailable?.bankLogoUrl} alt={`${web2mAvailable?.shortName} logo`} />
            </div>
            <span className="font-medium">{web2mAvailable?.name}</span>
          </div>
          <div>Banking</div>
        </div>
      )
    });
  }
  options.push(
    ...[
      {
        value: 'cryptomus',
        label: (
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="w-8 h-6 flex items-center justify-center">
                <img src={CryptocurrencyIcon} alt="Cryptocurrency" className="w-6 h-6" />
              </div>
              <span className="font-medium">Global (Cryptocurrency)</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div aria-describedby=":r10:" className="ant-image css-1trwq0a">
                <img
                  className="ant-image-img css-1trwq0a"
                  src="https://dl.922proxy.com/img/svg/cc_2.svg"
                  style={{ height: '2em', width: '2em' }}
                />
              </div>
              <div aria-describedby=":r12:" className="ant-image css-1trwq0a">
                <img
                  className="ant-image-img css-1trwq0a"
                  src="https://dl.922proxy.com/img/svg/trx.svg"
                  style={{ height: '2em', width: '2em' }}
                />
              </div>
              <div aria-describedby=":r14:" className="ant-image css-1trwq0a">
                <img
                  className="ant-image-img css-1trwq0a"
                  src="https://dl.922proxy.com/img/svg/cc_3.svg"
                  style={{ height: '2em', width: '2em' }}
                />
              </div>
              <div aria-describedby=":r16:" className="ant-image css-1trwq0a">
                <img
                  className="ant-image-img css-1trwq0a"
                  src="https://dl.922proxy.com/img/svg/cc_6.svg"
                  style={{ height: '2em', width: '2em' }}
                />
              </div>
              <div aria-describedby=":r18:" className="ant-image css-1trwq0a">
                <img
                  className="ant-image-img css-1trwq0a"
                  src="https://dl.922proxy.com/files/img/202304/16822401106515.svg"
                  style={{ height: '2em', width: '2em' }}
                />
              </div>
            </div>
          </div>
        )
      },
      ...(Object.entries(tazapayCountryOptions) ? Object.entries(tazapayCountryOptions) : []).map(([country, value]) => {
        return {
          value: 'tazapay-' + value,
          label: (
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <img className="w-8 h-6" src={`https://flagcdn.com/w20/${value.toLowerCase()}.png`} alt={`${value} flag`} />
                <span className="font-medium">{country}</span>
              </div>
              <div>{country} - Tazapay</div>
            </div>
          )
        };
      })
    ]
  );

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    try {
      const balanceData = await walletService.getBalance();
      setBalance(balanceData);
    } catch (error) {
      toast.error(t('toast.success.walletLoad'));
      console.log('Error fetching wallet balance:', error);
    }
  }, []);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, unknown> = {
        page: currentPage,
        per_page: pageSize
      };

      // Add search query if present
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Add date range if present
      if (dateRange.from) {
        params.start_date = formatDateForAPI(dateRange.from);
      }
      if (dateRange.to) {
        params.end_date = formatDateForAPI(dateRange.to);
      }

      const response = await transactionService.getBalanceHistory(params);

      // Transform data for display
      const transformedData = response.items.map((item) => transformTransaction(item, t));
      setTransactions(transformedData);
      setTotal(response.total);
    } catch (error) {
      toast.error(t('toast.error.historyLoad'));
      console.log('Error fetching transaction history:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, dateRange, t]);
  // Fetch data on mount
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, [fetchBalance, fetchTransactions]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1); // Reset to first page on search
      } else {
        fetchTransactions();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to first page when date range changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [dateRange]);

  const handlePageChange = (page: number, newPageSize?: number) => {
    setCurrentPage(page);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  const handleRefresh = () => {
    fetchBalance();
    fetchTransactions();
    toast.success(t('toast.success.newData'));
  };

  const walletCols = t('wallet.columns', { returnObjects: true }) as Record<string, string>;

  const columns: TableColumn<TransactionDisplay>[] = useMemo(() => {
    return [
      {
        key: 'stt',
        title: walletCols.stt || 'STT',
        width: '60px',
        align: 'center',
        render: (_value, _record, index) => index + 1,
        fixed: 'left'
      },
      {
        key: 'id',
        title: walletCols.id || 'ID',
        width: '160px',
        align: 'left',
        fixed: 'left',
        sortable: true,
        render: (value) => (
          <div className="flex items-center justify-between">
            <span className="truncate flex-1">{value}</span>
            <ContentCopy
              className="text-blue cursor-pointer ml-2"
              onClick={() => {
                copyToClipboard(value);
                toast.success(t('toast.success.transactionIdClipboard'));
              }}
            />
          </div>
        )
      },
      {
        key: 'date',
        title: walletCols.date || 'Date',
        width: 200,
        render: (value) => value || '-'
      },
      {
        width: 120,
        key: 'typeLabel',
        title: walletCols.type || 'Nạp Tiền',
        align: 'left',
        render: (value, record) => <Badge color={record.type === 'credit' ? 'green' : 'blue'}>{value}</Badge>
      },
      {
        key: 'amount',
        title: walletCols.amount || 'Amount',
        width: '120px',
        render: (value, record) => (
          <span className={record.type === 'credit' ? 'text-green' : 'text-red'}>
            {record.type === 'credit' ? '+' : '-'} ${Number(value).toFixed(2)}
          </span>
        )
      },
      {
        width: isMobile || isTablet ? 150 : '',
        key: 'description',
        title: walletCols.description || 'Description',
        align: 'left',
        render: (value) => <div className="truncate">{value || '...'}</div>
      },
      {
        key: 'status',
        title: walletCols.status || 'Status',
        width: '160px',
        align: 'center',
        render: (status) => <Badge color={status?.color || 'gray'}>{status?.text || '-'}</Badge>
      }
    ];
  }, [currentPage, pageSize, isMobile, isTablet, walletCols]);

  const handleTopup = () => {
    if (!topUpMethod) {
      toast.info(t('wallet.selectMethodPrompt') || 'Vui lòng chọn phương thức nạp tiền');
    }
    if (topUpMethod === 'web2m') {
      setTopUpModalOpen(true);
    }

    if (topUpMethod === 'tazapay') {
      const baseUrl = window.location.origin;
      generateTazapayPayment(
        {
          amount: priceValue,
          country: String(tazapayCountry),
          success_url: `${baseUrl}/wallet`,
          cancel_url: `${baseUrl}/wallet`
        },
        {
          onSuccess: (data) => {
            window.open(data.payment_url, '_blank');
            toast.success(t('toast.success.windowPaymentPop'));
            setTopUpModalOpen(false);
          },
          onError: (error) => {
            toast.error(t('toast.error.cantCreatePay'));
            console.log('Wallet payment error:', error);
          }
        }
      );
    }

    if (topUpMethod === 'cryptomus') {
      generateCryptomusPayment(
        { amount: priceValue },
        {
          onSuccess: (data) => {
            window.open(data.payment_url, '_blank');
            toast.success(t('toast.success.windowPaymentPop'));
            setTopUpModalOpen(false);
          },
          onError: (error) => {
            toast.error(t('toast.error.cantCreatePay'));
            console.log('Wallet payment error:', error);
          }
        }
      );
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="overflow-y-auto h-[calc(100dvh)] md:h-[calc(100dvh-104px)] flex flex-col"
    >
      {pageTitle}
      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex flex-col md:flex-row gap-5 p-5 items-stretch">
        {/* Left Panel - Top Up Section */}
        <div className="flex-1 p-5 shadow-md rounded-xl border border-border-element dark:border-border-element-dark dark:bg-bg-secondary-dark">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-text-hi dark:text-text-hi-dark mb-1 font-inter">{t('wallet.topUpYourWallet')}</h3>
              {/* Amount Display */}
              <div>
                <div className="relative text-text-hi dark:text-text-hi-dark">
                  <span className="absolute z-10 top-1/2 left-3 -translate-y-1/2 text-sm flex justify-center items-center h-5">$</span>
                  <InputField
                    wrapperClassName="pl-3 h-10"
                    value={priceValue}
                    onChange={(e) => setPriceValue(Math.min(+e.target.value, 1000))}
                  />
                </div>

                {/* Slider */}
                <div className="mt-2">
                  <Slider
                    min={10}
                    max={1000}
                    step={5}
                    value={priceValue}
                    onValueChange={setPriceValue}
                    formatValue={(val) => `$${val.toLocaleString()}`}
                    labels={['$10.00', '$1,000.00']}
                    labelValues={[10, 1000]}
                    showCurrentValue={false}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="">
              <h3 className="text-sm font-bold text-text-hi dark:text-text-hi-dark mb-1 font-inter">{t('wallet.Method')}</h3>
              <Select
                options={options}
                value={selectedMethod}
                onChange={(val) => {
                  setSelectedMethod(val);
                  if (val === 'web2m') {
                    setTopUpMethod('web2m');
                  } else if (val === 'cryptomus') {
                    setTopUpMethod('cryptomus');
                  } else if (typeof val === 'string' && val.startsWith('tazapay-')) {
                    setTopUpMethod('tazapay');
                    setTazapayCountry(val.split('-')[1].toUpperCase());
                  }
                }}
                placeholder={t('wallet.SelectMethod') || 'Select a top-up method'}
                placement="bottom"
                className="w-full h-10 dark:pseudo-border-top dark:border-transparent dark:bg-[#2B405A] font-inter"
              />
            </div>

            <div className="flex items-center gap-5 justify-between">
              {/* Submit Button */}

              {/* Terms */}
              <p className="text-sm flex-1 text-text-lo dark:text-text-lo-dark font-medium">
                {t('wallet.EULA')}
                <a
                  href="https://netproxy.io/en/term-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue dark:text-blue-dark underline"
                >
                  {t('wallet.EULA_link1')}
                </a>{' '}
                {t('wallet.EULA_connect')}
                <a
                  href="https://netproxy.io/en/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue dark:text-blue-dark underline"
                >
                  {t('wallet.EULA_link3')}
                </a>
              </p>
              <Button
                variant="primary"
                className="h-10 px-6 dark:pseudo-border-top-orange dark:border-transparent"
                onClick={handleTopup}
                loading={isTazapayPending || isCryptomusPending}
              >
                {t('wallet.topUp')}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {/* Wallet Card */}
        {(isDesktop || isLargeDesktop || isMobile) && (
          <BalanceCard
            balance={balance?.balance || 0}
            spent={balance?.total_purchased || 0}
            owner={getDisplayName()?.toUpperCase() || userProfile?.username?.toUpperCase() || 'USER'}
            variant="blue"
          />
        )}
      </motion.div>
      {/* Filter section */}
      <motion.div variants={itemVariants} className="p-5 pb-2">
        <div>
          <SectionTitle text={t('wallet.history')} />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 gap-3">
            {/* Left group (Search + Filter + Button) */}
            <div className={clsx('w-full flex flex-col gap-3', (isDesktop || isLargeDesktop) && '!flex-row')}>
              {/* Search field */}
              <Input
                inputWrapperClassName="w-full"
                placeholder={t('wallet.findingHistory') || 'Tìm lịch sử giao dịch...'}
                wrapperClassName={clsx(
                  'bg-bg-input border-2 h-10 w-full sm:w-[240px]',
                  isTablet && '!w-full',
                  (isDesktop || isLargeDesktop) && 'flex flex-col'
                )}
                icon={<MagnifyingGlass />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Row below for Date + Button (on mobile) */}
              <div className={clsx('flex items-center gap-3 sm:mt-0 flex-1 min-w-0 justify-between')}>
                <div className="flex-1">
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder={t('DateRangePicker') || 'Chọn khoảng thời gian'}
                    className={clsx('h-10 w-full sm:flex-none ', isTablet && '!w-full', (isDesktop || isLargeDesktop) && 'max-w-[220px]')}
                    triggerClassName="dark:bg-bg-primary-dark dark:pseudo-border-top dark:border-transparent"
                  />
                </div>

                <IconButton className="w-10 h-10" icon={<ArrowCounter />} onClick={handleRefresh} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex-1 overflow-hidden min-h-[350px] pb-5">
        <Table
          className="h-full"
          scroll={{ x: 300, y: isMobile || isTablet ? '' : 'calc(100dvh - 615px)' }}
          data={transactions}
          columns={columns}
          loading={loading}
          showEmptyRows
          pagination={{
            current: currentPage,
            pageSize,
            total: total,
            pageSizeOptions: [5, 10, 20, 50],
            className: '!pt-2 px-5 border-t-2 border-border-element dark:border-border-element-dark',
            onChange: handlePageChange
          }}
          paginationType="pagination"
          rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
          size="large"
          bordered={false}
        />
      </motion.div>

      {topUpMethod && (
        <TopUpModalV2
          amount={priceValue}
          paymentMethod={topUpMethod}
          open={topUpModalOpen}
          onClose={() => setTopUpModalOpen(false)}
          country={tazapayCountry}
        />
      )}
    </motion.div>
  );
};

export default WalletPage;
