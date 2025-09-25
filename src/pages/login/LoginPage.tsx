import { AuthFormWrapper } from '@/components/AuthFormWrapper';
import { Button } from '@/components/button/Button';
import { Checkbox } from '@/components/checkbox/Checkbox';
import { EmojiLaugh, Google, Lock, LockClosed, Person } from '@/components/icons';
import { InputField } from '@/components/input/InputField';
import { AuthLayout } from '@/layouts/AuthLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthShowcase } from './components/AuthShowCase';
import bgAuth from '@/assets/images/bg_auth.png';
import group7 from '@/assets/images/group-7.png';
import img9 from '@/assets/images/image-9.png';
import productCardImg from '@/assets/images/product-card.png';
import pcImg from '@/assets/images/pc.png';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/');
      setLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      left={
        <AuthFormWrapper title="Đăng Nhập" subtitle="Chào mừng bạn đã quay trở lại!">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <InputField type="email" placeholder="Nhập email" icon={<EmojiLaugh className="text-blue" />} required />
                <InputField
                  type="password"
                  placeholder="Nhập mật khẩu"
                  icon={<LockClosed className="text-primary" />}
                  required
                  showPasswordToggle
                />

                <a href="#" className="text-blue text-sm underline text-end font-medium">
                  Quên mật khẩu?
                </a>
              </div>
              <label className="flex items-center gap-2 w-fit">
                <Checkbox checked={remember} onChange={setRemember} />
                <span className="font-normal text-sm text-text-hi"> Lưu trạng thái đăng nhập</span>
              </label>

              <div className="flex flex-col gap-5">
                <Button type="submit" loading={loading} className="w-full">
                  ĐĂNG NHẬP
                </Button>

                {/* Divider */}
                <div className="flex items-center w-full">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-3 text-gray-400 text-sm">Hoặc</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Button */}
                <button className="flex items-center justify-center gap-3 w-full py-3 px-5 border-2  rounded-full shadow-xs hover:shadow-md transition-shadow bg-white">
                  <Google />
                  <span className="font-medium text-gray-700">GOOGLE</span>
                </button>
              </div>
            </div>
          </form>

          <p className="text-center text-sm">
            Bạn chưa có tài khoản?{' '}
            <a href="/register" className="text-blue hover:underline">
              Đăng ký
            </a>
          </p>
        </AuthFormWrapper>
      }
      right={
        <div className="w-[720px] justify-center items-center gap-1 p-5 hidden md:flex relative">
          <AuthShowcase
            bg={bgAuth}
            images={[
              {
                src: group7,
                className: 'absolute w-[119px] h-[141px] top-[15px] left-[516px] mix-blend-soft-light'
              },
              {
                src: img9,
                className: 'aspect-[91/60] w-[606px] h-[405px] top-[100px] left-[37px] absolute object-contain'
              },
              {
                src: productCardImg,
                className: 'aspect-[101/108] w-[180px] h-[193px] top-[360px] left-[479px] absolute object-contain'
              },
              {
                src: pcImg,
                className: 'absolute w-[132px] h-[154px] top-[274px] left-0 object-contain'
              }
            ]}
            title="Proxy Tốc Độ Cao"
            description={
              <>
                Giải pháp an toàn, tăng cường bảo mật
                <br />
                và tối ưu hiệu suất kết nối.
              </>
            }
          />
        </div>
      }
    />
  );
};
