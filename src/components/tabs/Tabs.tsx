import clsx from 'clsx';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

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

  className?: string;
  defaultWrapperClass?: string;
  cardWrapperClass?: string;
  itemWrapperClass?: string;
  contentCardWrapperClass?: string;
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
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  children,
  type = 'default',
  activeKey,
  defaultActiveKey,
  onChange,
  className,
  defaultWrapperClass,
  cardWrapperClass,
  itemWrapperClass,
  contentCardWrapperClass
}) => {
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
        <div className={defaultWrapperClass}>
          <div className={twMerge('relative border-b-2 h-10 border-border-element dark:border-border-element-dark pl-5', className)}>
            <div className={clsx('flex w-fit gap-5 relative', itemWrapperClass)}>
              {tabs.map((tab) => {
                const isActive = currentActive === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleClick(tab.key)}
                    className={`relative text-sm px-2 py-[10px] font-medium transition-colors duration-200
                ${isActive ? 'text-primary' : 'text-text-lo dark:text-text-lo-dark hover:text-primary'}`}
                    ref={(el) => {
                      if (isActive && el) {
                        const rect = el.getBoundingClientRect();
                        const parentRect = el.parentElement?.getBoundingClientRect();
                        const offsetLeft = rect.left - (parentRect?.left ?? 0);

                        const indicator = document.querySelector<HTMLSpanElement>('#tab-indicator');
                        if (indicator) {
                          indicator.style.width = `${rect.width}px`;
                          indicator.style.transform = `translateX(${offsetLeft}px)`;
                        }
                      }
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
              {/* underline indicator */}
              <span id="tab-indicator" className="absolute bottom-0 h-[2px] bg-primary transition-all duration-300 ease-in-out" />
            </div>
          </div>
          <>{children[tabs.findIndex((tab) => tab.key === currentActive)]}</>
        </div>
      )}

      {type === 'card' && (
        <div className={cardWrapperClass}>
          <div className="border-b-2 border-border-element dark:border-border-element-dark py-2 px-5 overflow-auto scrollbar-hide min-h-fit">
            {/* Wrapper có scroll ngang + ẩn scrollbar */}
            <div className="relative w-full overflow-x-visible" id="tab-scroll-container">
              <div className="flex w-fit flex-nowrap rounded-lg lg:gap-1 p-1 bg-bg-mute dark:bg-bg-mute-dark relative">
                {tabs.map((tab) => {
                  const isActive = currentActive === tab.key;

                  return (
                    <button
                      key={tab.key}
                      onClick={(e) => {
                        handleClick(tab.key);

                        //  Tự cuộn khi tab bị che
                        const container = document.getElementById('tab-scroll-container');
                        const target = e.currentTarget as HTMLElement;

                        if (container && target) {
                          const rect = target.getBoundingClientRect();
                          const parentRect = container.getBoundingClientRect();
                          const scrollLeft = container.scrollLeft;
                          const targetLeft = rect.left - parentRect.left + scrollLeft;
                          const targetCenter = targetLeft - container.clientWidth / 2 + rect.width / 2;

                          container.scrollTo({
                            left: targetCenter,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`relative text-sm font-medium flex items-center gap-2 px-4 py-[10px] rounded-lg transition-colors duration-200 z-10 min-w-max
                  ${isActive ? 'text-white !font-bold' : 'text-text-lo hover:bg-bg-hover-gray hover:dark:bg-bg-hover-gray-dark'}`}
                      ref={(el) => {
                        if (isActive && el) {
                          //  Cập nhật vị trí highlight
                          const rect = el.getBoundingClientRect();
                          const parentRect = el.parentElement?.getBoundingClientRect();
                          const offsetLeft = rect.left - (parentRect?.left ?? 0) - 4;

                          const highlight = document.querySelector<HTMLDivElement>('#tab-highlight');
                          if (highlight) {
                            highlight.style.width = `${rect.width}px`;
                            highlight.style.height = `${rect.height}px`;
                            highlight.style.transform = `translateX(${offsetLeft}px)`;
                          }

                          // Khi tab active bị che — tự scroll vào view
                          const container = document.getElementById('tab-scroll-container');
                          if (container) {
                            const cRect = container.getBoundingClientRect();
                            if (rect.left < cRect.left || rect.right > cRect.right) {
                              const scrollLeft = container.scrollLeft;
                              const targetLeft = rect.left - cRect.left + scrollLeft;
                              const targetCenter = targetLeft - container.clientWidth / 2 + rect.width / 2;

                              container.scrollTo({
                                left: targetCenter,
                                behavior: 'smooth'
                              });
                            }
                          }
                        }
                      }}
                    >
                      {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}

                {/* Background highlight (vẫn giữ transition mượt) */}
                <div id="tab-highlight" className="absolute bg-primary rounded-lg transition-all duration-300 ease-in-out z-0 shadow-xs" />
              </div>
            </div>
          </div>

          {/* Nội dung tab */}
          <div className={contentCardWrapperClass}>{children[tabs.findIndex((tab) => tab.key === currentActive)]}</div>
        </div>
      )}
    </>
  );
};
