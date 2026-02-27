import { useState, useEffect } from 'react';
import { Modal } from '@/components/modal/Modal';
import { Button } from '@/components/button/Button';
import { Subscription } from '@/types/subscription';
import { subscriptionService } from '@/services/subscription/subscription.service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ContentCopy } from '@/components/icons';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { getIpAddressByProxyType, getPortByProxyType, getUsernameByProxyType, getPasswordByProxyType, isRotatingProxy } from './utils';
import moment from 'moment';

interface ProxyDetailModalProps {
  subscription: Subscription | null;
  open: boolean;
  onClose: () => void;
  onNoteSaved?: (subscriptionId: string, notes: string | null) => void;
}

export const ProxyDetailModal = ({ subscription, open, onClose, onNoteSaved }: ProxyDetailModalProps) => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (subscription && open) {
      setNotes(subscription.notes || '');
      setHasChanges(false);
    }
  }, [subscription, open]);

  if (!subscription) return null;

  const isRotating = isRotatingProxy(subscription);
  const ipAddress = getIpAddressByProxyType(subscription);
  const port = getPortByProxyType(subscription);
  const username = getUsernameByProxyType(subscription);
  const { plainPassword } = getPasswordByProxyType(subscription);
  const credentials = subscription.provider_credentials as any;
  const connectionType = isRotating ? 'HTTP/HTTPS' : credentials?.http_port > 0 ? 'HTTPS' : credentials?.socks5_port > 0 ? 'SOCKS5' : '-';

  const handleSave = async () => {
    if (!subscription) return;
    setSaving(true);
    try {
      const trimmedNotes = notes.trim() || null;
      await subscriptionService.updateNotes(subscription.id, trimmedNotes);
      toast.success(t('toast.success.noteSaved'));
      setHasChanges(false);
      onNoteSaved?.(subscription.id, trimmedNotes);
    } catch {
      toast.error(t('toast.error.noteSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasChanges(value !== (subscription.notes || ''));
  };

  const infoRows = [
    { label: 'ID', value: subscription.id },
    { label: t('ipAddress'), value: ipAddress },
    { label: 'Port', value: port },
    { label: t('Username'), value: username },
    { label: t('password'), value: plainPassword },
    { label: 'Type', value: connectionType },
    { label: t('country'), value: subscription.country || '-' },
    { label: t('expired'), value: moment(subscription.expires_at || subscription.current_period_end).format('DD/MM/YYYY HH:mm') }
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('proxyDetail')}
      className="max-w-lg"
      cancelButton={
        <Button variant="outlined" onClick={onClose} size="sm">
          {t('close')}
        </Button>
      }
      actions={[
        <Button key="save" onClick={handleSave} disabled={saving || !hasChanges} size="sm">
          {saving ? t('loading') : t('save')}
        </Button>
      ]}
    >
      <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
        {/* Proxy info */}
        <div className="space-y-2">
          {infoRows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-2 group">
              <span className="text-xs text-text-lo dark:text-text-lo-dark shrink-0">{row.label}</span>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-xs font-mono text-text-hi dark:text-text-hi-dark truncate">{row.value}</span>
                <ContentCopy
                  className="text-blue dark:text-blue-dark w-3.5 h-3.5 shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={async () => {
                    await copyToClipboard(row.value);
                    toast.success(t('toast.success.cpuClipboard'));
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border-element dark:border-border-element-dark" />

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-text-hi dark:text-text-hi-dark">
            {t('note')} <span className="text-text-lo dark:text-text-lo-dark font-normal text-xs">({t('optional')})</span>
          </label>
          <textarea
            className="w-full rounded-lg border-2 border-border-element dark:border-border-element-dark bg-bg-input dark:bg-bg-input-dark text-text-hi dark:text-text-hi-dark text-sm p-3 resize-none focus:outline-none focus:border-primary dark:focus:border-primary-dark"
            rows={3}
            maxLength={500}
            placeholder={t('enterNote')}
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            disabled={saving}
          />
          <p className="text-xs text-text-lo dark:text-text-lo-dark text-right">{notes.length}/500</p>
        </div>
      </div>
    </Modal>
  );
};
