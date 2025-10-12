import androidIcon from '@/assets/images/android.png';
import chromeIcon from '@/assets/images/chrome.png';
import linuxIcon from '@/assets/images/linux.png';
import macIcon from '@/assets/images/mac.png';
import windowsIcon from '@/assets/images/windows.png';
import { AppCard } from '@/components/card/AppCard';
const SupportSoftwarePage = () => {
  const apps = [
    {
      icon: <img src={chromeIcon} alt="Chrome" className="w-10 h-10" />,
      title: 'Ứng dụng trên Chrome',
      description: 'It is a long established fact that a reader will be distracted by the readable content'
    },
    {
      icon: <img src={androidIcon} alt="Android" className="w-10 h-10" />,
      title: 'Ứng dụng trên Android',
      description: 'It is a long established fact that a reader will be distracted by the readable content'
    },
    {
      icon: <img src={windowsIcon} alt="Windows" className="w-10 h-10" />,
      title: 'Ứng dụng trên Windows',
      description: 'It is a long established fact that a reader will be distracted by the readable content'
    },
    {
      icon: <img src={macIcon} alt="Mac" className="w-10 h-10" />,
      title: 'Ứng dụng trên Mac',
      description: 'It is a long established fact that a reader will be distracted by the readable content'
    },
    {
      icon: <img src={linuxIcon} alt="Linux" className="w-10 h-10" />,
      title: 'Ứng dụng trên Linux',
      description: 'It is a long established fact that a reader will be distracted by the readable content'
    }
  ];

  return (
    <div className="p-5">
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-5">
        {apps.map((app, idx) => (
          <AppCard
            key={idx}
            icon={app.icon}
            title={app.title}
            description={app.description}
            onButtonClick={() => alert(`Cài đặt ${app.title}`)}
            className="md:w-[264px]"
          />
        ))}
      </div>
    </div>
  );
};

export default SupportSoftwarePage;
