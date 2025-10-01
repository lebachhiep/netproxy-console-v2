import React, { useState } from 'react';

interface TabItem {
  /** Label hiển thị */
  label: string;

  /** Key duy nhất */
  key: string | number;

  /** Icon hiển thị cạnh label */
  icon?: React.ReactNode;
}

interface TabsProps {
  /** Danh sách các tab */
  tabs: TabItem[];

  /** Nội dung của từng tab, thứ tự phải khớp với `tabs` */
  children: React.ReactNode[];

  /** Kiểu hiển thị */
  type?: 'default' | 'card';

  /** Active tab hiện tại (controlled) */
  activeKey?: string | number;

  /** Active tab mặc định (uncontrolled) */
  defaultActiveKey?: string | number;

  /** Callback khi tab thay đổi */
  onChange?: (key: string | number) => void;
}

/**
 * Component Tabs
 *
 * Tab navigation với 2 kiểu:
 * - `default`: tab truyền thống, chỉ highlight active tab dưới dạng border-bottom
 * - `card`: tab dạng card, có shadow, icon, highlight nền và chữ
 *
 * Hỗ trợ:
 * - Controlled: thông qua prop `activeKey`
 * - Uncontrolled: thông qua prop `defaultActiveKey`
 * - Callback onChange khi tab được chọn
 * - Có thể gắn icon cho từng tab
 *
 * @component
 *
 * @example
 * const tabs = [
 *   { key: 'tab1', label: 'Tab 1' },
 *   { key: 'tab2', label: 'Tab 2', icon: <MyIcon /> }
 * ];
 *
 * <Tabs tabs={tabs} defaultActiveKey="tab1" onChange={(key) => console.log(key)}>
 *   <div>Content của Tab 1</div>
 *   <div>Content của Tab 2</div>
 * </Tabs>
 *
 */
export const Tabs: React.FC<TabsProps> = ({ tabs, children, type = 'default', activeKey, defaultActiveKey, onChange }) => {
  const [internalActive, setInternalActive] = useState<string | number>(defaultActiveKey ?? tabs[0]?.key);

  const isControlled = activeKey !== undefined;
  const currentActive = isControlled ? activeKey : internalActive;

  const handleClick = (key: string | number) => {
    if (!isControlled) {
      setInternalActive(key);
    }
    onChange?.(key);
  };

  return (
    <>
      {type === 'default' && (
        <div>
          <div className="border-b-2 h-10 border-border-element dark:border-border-element-dark">
            <div className={`flex w-fit rounded-lg gap-5 pl-5`}>
              {tabs.map((tab) => {
                const isActive = currentActive === tab.key;

                return (
                  <button
                    key={tab.key}
                    onClick={() => handleClick(tab.key)}
                    className={`text-sm px-2 py-[10px] -mb-px font-medium
                  ${isActive ? 'border-b-2 border-primary text-primary' : 'text-text-lo dark:text-text-lo-dark hover:text-primary'}`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>{children[tabs.findIndex((tab) => tab.key === currentActive)]}</div>
        </div>
      )}

      {type === 'card' && (
        <div>
          <div className="border-b-2 border-border-element dark:border-border-element-dark py-2 px-5">
            <div className="relative flex w-fit rounded-lg gap-1 p-1 bg-bg-mute dark:bg-bg-mute-dark">
              {tabs.map((tab) => {
                const isActive = currentActive === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleClick(tab.key)}
                    className={`relative text-sm font-medium flex items-center gap-2 px-4 py-[10px] rounded-lg transition-colors duration-200 z-10
              ${isActive ? 'text-white !font-bold' : 'text-text-lo hover:bg-bg-hover-gray hover:dark:bg-bg-hover-gray-dark'}`}
                    ref={(el) => {
                      if (isActive && el) {
                        const rect = el.getBoundingClientRect();
                        const parentRect = el.parentElement?.getBoundingClientRect();
                        const offsetLeft = rect.left - (parentRect?.left ?? 0);

                        const highlight = document.querySelector<HTMLDivElement>('#tab-highlight');
                        if (highlight) {
                          highlight.style.width = `${rect.width}px`;
                          highlight.style.height = `${rect.height}px`;
                          highlight.style.transform = `translateX(${offsetLeft}px)`;
                        }
                      }
                    }}
                  >
                    {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              {/* background highlight */}
              <div id="tab-highlight" className="absolute bg-primary rounded-lg transition-all duration-300 ease-in-out z-0 shadow-xs" />
            </div>
          </div>
          <div>{children[tabs.findIndex((tab) => tab.key === currentActive)]}</div>
        </div>
      )}
    </>
  );
};
