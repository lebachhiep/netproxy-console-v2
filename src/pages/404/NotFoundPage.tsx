import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '@/hooks/usePageTitle';

export const NotFoundPage: React.FC = () => {
  const pageTitle = usePageTitle({ pageName: '404 - Không tìm thấy' });
  const navigate = useNavigate();

  return (
    <>
      {pageTitle}
      <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-gray-50 px-4">
      {/* Status Code */}
      <h1 className="text-9xl font-extrabold text-primary">404</h1>

      {/* Title */}
      <h2 className="mt-4 text-2xl font-bold text-gray-800">Trang không tồn tại</h2>

      {/* Subtitle */}
      <p className="mt-2 text-gray-600">Xin lỗi, trang bạn đang tìm không tồn tại hoặc đã bị xóa.</p>

      {/* Action */}
      <button
        onClick={() => navigate('/')}
        className="mt-6 bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
      >
        Về trang chủ
      </button>
      </div>
    </>
  );
};
