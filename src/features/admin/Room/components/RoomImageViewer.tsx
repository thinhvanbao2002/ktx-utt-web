// import { Modal } from 'antd';
// import React360View from 'react-360-view';
// import { IRoom } from '../Room.props';

// interface RoomImageViewerProps {
//   visible: boolean;
//   onCancel: () => void;
//   room: IRoom | null;
// }

// const RoomImageViewer = ({ visible, onCancel, room }: RoomImageViewerProps) => {
//   if (!room?.images || room.images.length === 0) {
//     return null;
//   }

//   return (
//     <Modal
//       title={`Xem ảnh phòng ${room.roomNumber}`}
//       open={visible}
//       onCancel={onCancel}
//       footer={null}
//       width={800}
//     >
//       <div className="w-full h-[500px]">
//         <React360View
//           count={room.images.length}
//           imagePath={room.images.map(img => img.url)}
//           fileName=""
//           autoplay
//           loop
//         />
//       </div>
//     </Modal>
//   );
// };

// export default RoomImageViewer;
