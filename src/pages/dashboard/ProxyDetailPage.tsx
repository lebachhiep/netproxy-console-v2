// src/pages/proxy/ProxyDetailPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowCounter, Chevron, ContentCopy, Eye, EyeOff, FileCopy, Key, Language, Location, MagnifyingGlass } from '@/components/icons';
import IconButton from '@/components/button/IconButton';
import { Input } from '@/components/input/Input';
import { Select } from '@/components/select/Select';
import { SelectTag } from '@/components/select/SelectTag';
import { Table, TableColumn } from '@/components/table/Table';
import {
  bandwidthTabs,
  columnsBandwidth,
  countryOptions,
  HeaderInfo,
  locationOptions,
  optionsTagSelect,
  ProxyData
} from './components/modal/ProxyDetailModal';
import { data } from './DashboardPage';
import { Tabs } from '@/components/tabs/Tabs';
import { ApiInput } from '@/components/input/ApiInput';
import { ActionButtons } from '@/components/button/ActionButtons';
import { Switch } from '@/components/switch/Switch';
import { Button } from '@/components/button/Button';
import { useResponsive } from '@/hooks/useResponsive';
import { Pagination } from '@/components/pagination/Pagination';
import { toast } from 'sonner';
import { motion, Variants } from 'framer-motion';
import { sectionVariants } from '@/utils/animation';

export const ProxyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [autoRenew, setAutoRenew] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const { isMobile } = useResponsive();
  const [apiValue, setApiValue] = useState('https://api.netproxy.io/api/bandwidthProxy/getProxies?apiKey=823321...');
  const [isHideApiValue, setIsHideApiValue] = useState(true);

  const item = data.find((item) => item.id == id);

  console.log({ item });
  if (!item) {
    return;
  }

  const tableData: ProxyData[] = [
    { id: '1', name: 'Proxy xoay - 5GB', key: 'ABC123', location: 'VN' },
    { id: '2', name: 'Proxy xoay - 10GB', key: 'DEF456', location: 'US' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' },
    { id: '3', name: 'Proxy xoay - 20GB', key: 'GHI789', location: 'JP' }
  ];

  const columns: TableColumn<ProxyData>[] = [
    {
      key: 'select',
      title: 'STT',
      render: (_, __, index) => <>{index + 1}</>,
      width: 50,
      align: 'center'
    },
    {
      key: 'name',
      title: 'Tên Gói',
      width: 200,
      sortable: true,
      render: (value) => <div className="line-clamp-1">{value}</div>
    },
    {
      key: 'key',
      title: (
        <div className="flex items-center gap-1">
          <Key className="text-text-lo dark:text-text-lo-dark" />
          <span>Key</span>
        </div>
      ),
      render: (value) => (
        <div className="flex items-center justify-between">
          <span>•••</span>
          <ContentCopy className="text-blue cursor-pointer" />
        </div>
      ),
      width: 140
    },
    {
      key: 'location',
      title: (
        <div className="flex items-center gap-1">
          <Location className="text-text-lo dark:text-text-lo-dark" />
          <span>Vị trí</span>
        </div>
      ),
      render: (value) => (
        <Select
          labelClassName="font-medium text-text-me"
          className="h-8"
          options={locationOptions}
          value={value}
          onChange={(newValue) => console.log('Selected:', newValue)}
        />
      ),

      width: 150
    },
    {
      width: 125,
      key: 'action',
      title: 'Hành động',
      render: () => (
        <Button variant="default" icon={<Language className="text-text-lo text-sm" />} className="h-8">
          Lấy Proxy
        </Button>
      ),
      align: 'center',
      fixed: 'right'
    }
  ];

  return (
    <>
      <div className="bg-bg-canvas dark:bg-bg-canvas-dark h-full flex flex-col">
        <div className="md:hidden flex items-center justify-between h-12 px-5 py-3 border-b border-border dark:border-border-dark dark:bg-bg-primary-dark">
          <div className="flex items-center gap-1">
            <span className="text-sm text-text-hi dark:text-text-hi-dark font-medium" onClick={() => navigate('/home')}>
              Trang chủ
            </span>
            <Chevron className="w-4 h-4 rotate-180 text-text-me dark:text-text-me-dark" />
            <span className="text-sm text-text-lo dark:text-text-lo-dark font-medium">{item.title}</span>
          </div>
        </div>
        {item.type === 'bandwidth-proxy' ? (
          <div className="flex-1 h-[calc(100dvh-190px)] md:h-auto">
            <Tabs
              tabs={bandwidthTabs}
              className="bg-bg-primary dark:bg-bg-primary-dark"
              defaultWrapperClass="h-full flex flex-col"
              defaultActiveKey="list"
            >
              {/* Tab 1: Danh sách Proxy */}
              <div className="h-full flex flex-col overflow-auto">
                <div className="border-b-[2px] py-3 px-5 border-border-element dark:border-border-element-dark bg-bg-primary dark:bg-bg-primary-dark">
                  {/* Header info */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-text-hi dark:text-text-hi-dark">
                      <label className="text-sm min-w-[120px]">Ngày hết hạn</label>
                      <span className="font-semibold text-base">{item.expired}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-text-hi dark:text-text-hi-dark text-sm min-w-[120px]">Data left</label>
                      <div className="text-base">
                        <span className="text-primary dark:text-primary-dark font-medium">40.8</span>
                        <span className="font-normal text-text-hi dark:text-text-hi-dark"> / </span>
                        <span className="font-normal text-text-hi dark:text-text-hi-dark">50 GB</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-hi dark:text-text-hi-dark text-sm min-w-[120px]">Tự động gia hạn</span>
                      <Switch checked={false} onChange={() => {}} />
                    </div>
                  </div>
                </div>
                {/* Filter + table */}
                <div className="py-2 px-5 bg-bg-primary dark:bg-bg-primary-dark">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Input
                        placeholder="Tìm kiếm"
                        wrapperClassName="bg-bg-input border-2 h-10"
                        inputClassName="h-10 min-w-0"
                        icon={<MagnifyingGlass />}
                        onChange={(e) => console.log(e.target.value)}
                      />
                      <Select
                        className="h-10 md:min-w-[179px] dark:pseudo-border-top dark:border-transparent dark:bg-bg-secondary-dark"
                        options={optionsTagSelect}
                        placeholder="Type"
                        onChange={(val) => console.log('Selected:', val)}
                      />
                      <Select
                        className="h-10 md:min-w-[179px] dark:pseudo-border-top dark:border-transparent dark:bg-bg-secondary-dark"
                        options={optionsTagSelect}
                        placeholder="ISP"
                        onChange={(val) => console.log('Selected:', val)}
                      />
                    </div>
                    <IconButton className="w-10 h-10" icon={<ArrowCounter />}></IconButton>
                  </div>
                </div>

                {/* Table danh sách proxy */}
                <motion.div variants={sectionVariants} className="relative flex-1 flex flex-col overflow-hidden min-h-[350px] pb-5">
                  <Table
                    className="h-full"
                    scroll={{ x: 300, y: 'calc(100dvh - 475px)' }}
                    data={tableData}
                    columns={columnsBandwidth}
                    pagination={{
                      current: currentPage,
                      pageSize,
                      total: tableData.length,
                      className: 'px-5 pt-2 pb-5',
                      pageSizeOptions: [10, 20, 50, 100],
                      onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                      }
                    }}
                    paginationType="pagination"
                    size="large"
                    bordered={false}
                    rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
                  />
                </motion.div>
              </div>

              {/* Tab 2 */}
              <div className="h-full flex flex-col overflow-auto">
                <div className="border-b-[2px] py-3 px-5 border-border-element dark:border-border-element-dark bg-bg-primary dark:bg-bg-primary-dark">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-text-hi dark:text-text-hi-dark">
                      <label className="text-sm min-w-[120px]">Ngày hết hạn</label>
                      <span className="font-semibold text-base">{item.expired}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-text-hi dark:text-text-hi-dark text-sm min-w-[120px]">Data left</label>
                      <div className="text-base">
                        <span className="text-primary dark:text-primary-dark font-medium">40.8</span>
                        <span className="font-normal text-text-hi dark:text-text-hi-dark"> / </span>
                        <span className="font-normal text-text-hi dark:text-text-hi-dark">50 GB</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-hi dark:text-text-hi-dark text-sm min-w-[120px]">Tự động gia hạn</span>
                      <Switch checked={false} onChange={() => {}} />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2">
                    <Select
                      className="h-10 w-[100px] whitespace-nowrap dark:pseudo-border-top dark:border-transparent"
                      placeholder="Quốc gia"
                      options={countryOptions}
                    />
                    <ApiInput
                      className="h-10"
                      value={isHideApiValue ? '*'.repeat(apiValue.length) : apiValue}
                      actions={[
                        {
                          icon: isHideApiValue ? (
                            <EyeOff className="text-primary dark:text-primary-dark w-6 h-6" />
                          ) : (
                            <Eye className="text-primary dark:text-primary-dark w-6 h-6" />
                          ),
                          onClick: () => setIsHideApiValue(!isHideApiValue)
                        },
                        {
                          icon: <FileCopy className="text-blue dark:text-blue-dark w-6 h-6" />,
                          onClick: () => {
                            navigator.clipboard.writeText(apiValue);
                            toast.success('Đã sao chép API Endpoint');
                          }
                        }
                      ]}
                    />
                  </div>
                </div>
              </div>
              {/* Tab 3 */}
              <div className="p-5">Content tab "White list"</div>
            </Tabs>
          </div>
        ) : (
          <div className="flex-1 h-full md:h-auto overflow-scroll flex flex-col">
            <div className="border-b-[2px] py-3 px-5 border-border-element dark:border-border-element-dark bg-bg-primary dark:bg-bg-primary-dark">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-text-hi dark:text-text-hi-dark">
                  <label className="text-sm min-w-[120px]">Ngày hết hạn</label>
                  <span className="font-semibold text-base">{item.expired}</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-text-hi dark:text-text-hi-dark text-sm min-w-[120px]">Data left</label>
                  <div className="text-base">
                    <span className="text-primary dark:text-primary-dark font-medium">40.8</span>
                    <span className="font-normal text-text-hi dark:text-text-hi-dark"> / </span>
                    <span className="font-normal text-text-hi dark:text-text-hi-dark">50 GB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-hi dark:text-text-hi-dark text-sm min-w-[120px]">Tự động gia hạn</span>
                  <Switch checked={false} onChange={() => {}} />
                </div>
              </div>
            </div>

            {/* Filter + table */}
            <div className="py-3 px-5 bg-bg-primary dark:bg-bg-primary-dark">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Input
                    placeholder="Tìm kiếm"
                    wrapperClassName="bg-bg-input border-2 h-10"
                    inputClassName="h-10 min-w-0"
                    icon={<MagnifyingGlass />}
                    onChange={(e) => console.log(e.target.value)}
                  />
                  <SelectTag
                    className="h-10"
                    options={optionsTagSelect}
                    placeholder="Trạng thái"
                    onChange={(val) => console.log('Selected:', val)}
                  />
                </div>
                <IconButton className="w-10 h-10" icon={<ArrowCounter />}></IconButton>
              </div>
            </div>
            <motion.div variants={sectionVariants} className="relative flex-1 flex flex-col overflow-scroll h-full min-h-[350px] pb-5">
              <Table
                // className="min-h-[calc(100dvh-475px)] md:min-h-[calc(100dvh-445px)]"
                className="h-full"
                scroll={{ x: 300, y: 'calc(100dvh - 535px)' }}
                data={tableData}
                columns={columns}
                rowSelection={{
                  selectedRowKeys,
                  onChange: (keys, rows) => setSelectedRowKeys(keys)
                }}
                pagination={{
                  current: currentPage,
                  pageSize,
                  total: tableData.length,
                  className: 'px-5 pt-2 ',
                  onChange: (page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }
                }}
                paginationType="pagination"
                rowClassName={(record, index) => (index % 2 === 0 ? '' : 'bg-bg-mute')}
                size="large"
                bordered={false}
                showEmptyRows
              />
            </motion.div>
            <div className="px-5 py-3 border-t-2 border-b-2 border-border dark:border-border-dark">
              <ActionButtons />
            </div>

            <div className="px-5 pt-2 pb-5 md:pb-0">
              <Pagination
                type="pagination"
                current={currentPage}
                pageSize={pageSize}
                total={tableData.length}
                pageSizeOptions={[10, 20, 50, 100]}
                onChange={(page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                }}
              />
            </div>
          </div>
        )}

        {/* Header info */}
      </div>
    </>
  );
};
