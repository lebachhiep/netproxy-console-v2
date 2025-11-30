import androidIcon from '@/assets/images/android.png';
import chromeIcon from '@/assets/images/chrome.png';
import linuxIcon from '@/assets/images/linux.png';
import macIcon from '@/assets/images/mac.png';
import windowsIcon from '@/assets/images/windows.png';
import { AppCard } from '@/components/card/AppCard';
import { pageVariants } from '@/utils/animation';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';

const SupportSoftwarePage = () => {
  const pageTitle = usePageTitle({ pageName: 'Phần mềm hỗ trợ' });
  const apps = [
    {
      icon: <img src={chromeIcon} alt="Chrome" className="w-10 h-10" />,
      title: 'Ứng dụng trên Chrome',
      description: 'It is a long established fact that a reader will be distracted by the readable content',
      href: 'https://chromewebstore.google.com/detail/mnloefcpaepkpmhaoipjkpikbnkmbnic?utm_source=item-share-cb'
    },
    {
      icon: <img src={androidIcon} alt="Android" className="w-10 h-10" />,
      title: 'Ứng dụng trên Android',
      description: 'It is a long established fact that a reader will be distracted by the readable content',
      href: 'https://play.google.com/store/apps/details?id=com.scheler.superproxy'
    },
    {
      icon: <img src={windowsIcon} alt="Windows" className="w-10 h-10" />,
      title: 'Ứng dụng trên Windows',
      description: 'It is a long established fact that a reader will be distracted by the readable content',
      href: 'https://www.proxifier.com/'
    },
    {
      icon: <img src={macIcon} alt="Mac" className="w-10 h-10" />,
      title: 'Ứng dụng trên Mac',
      description: 'It is a long established fact that a reader will be distracted by the readable content',
      href: 'https://apps.apple.com/us/app/shadowrocket/id932747118'
    }
    // {
    //   icon: <img src={linuxIcon} alt="Linux" className="w-10 h-10" />,
    //   title: 'Ứng dụng trên Linux',
    //   description: 'It is a long established fact that a reader will be distracted by the readable content'
    // }
  ];

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-5 h-full overflow-auto">
      {pageTitle}
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-5">
        {apps.map((app, idx) => (
          <AppCard
            key={idx}
            icon={app.icon}
            title={app.title}
            description={app.description}
            onButtonClick={() => {
              window.open(app.href, '_blank');
            }}
            className="md:w-[264px]"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SupportSoftwarePage;
