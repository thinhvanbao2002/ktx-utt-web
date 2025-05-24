/* eslint-disable react-refresh/only-export-components */
import { ADMIN_PATH, USER_PATH } from 'common/constants/paths.ts'
import React, { lazy } from 'react'

//Layout
const AdminLayout = lazy(() => import('../common/layout/AdminLayout/adminLayout.tsx'))

//Admin
const AdminDashBoard = lazy(() => import('../features/admin/AdminDashboard/adminDashboard.tsx'))
const ManagerPage = lazy(() => import('../features/admin/Manager/ManagerPage.tsx'))
const CustomerPage = lazy(() => import('../features/admin/Customer/CustomerPage.tsx'))
const CategoryPage = lazy(() => import('../features/admin/Building/BuildingPage.tsx'))
const AdminProductPage = lazy(() => import('../features/admin/Room/RoomPage.tsx'))
const AdminProductForm = lazy(() => import('../features/admin/Room/components/AddEditRoom.tsx'))
const BlogForm = lazy(() => import('../features/admin/Blog/BlogPage.tsx'))
const AddEditBlogPage = lazy(() => import('../features/admin/Blog/components/AddEditBlog.tsx'))
const AdminOrderPage = lazy(() => import('../features/admin/Order/OrderPage.tsx'))
const AdminEditOrder = lazy(() => import('../features/admin/Order/components/OrderDetail.tsx'))
const RoomType = lazy(() => import('../features/admin/RoomType/RoomTypePage.tsx'))
const DevicePage = lazy(() => import('../features/admin/Device/DevicePage.tsx'))
const RoomImageView = lazy(() => import('../features/admin/Room/components/RoomImageView.tsx'))

//User
const HomePage = lazy(() => import('../features/admin/AdminDashboard/adminDashboard.tsx'))
const UserLayout = lazy(() => import('../common/layout/UserLayout/userLayout.tsx'))
const CustomerLoginPage = lazy(() => import('../features/admin/Auth/auth.tsx'))
const RegisterPage = lazy(() => import('../features/customer/register/Register.tsx'))
const ProductPage = lazy(() => import('../features/customer/product/Product.tsx'))
const ProductDetail = lazy(() => import('../features/customer/detailProduct/DetailProduct.tsx'))
const CartPage = lazy(() => import('../features/customer/cart/Cart.tsx'))
const OrderPage = lazy(() => import('../features/customer/order/Order.tsx'))
const UploadFile = lazy(() => import('../common/components/upload/UploadComponent.tsx'))
const UploadMultipartFile = lazy(() => import('../common/components/upload/UploadMultipartComponent.tsx'))
const OrderSuccess = lazy(() => import('../features/customer/successOrder/SuccessOrder.tsx'))
const OrderHistory = lazy(() => import('../features/customer/order/OrderHistory.tsx'))
const BlogPage = lazy(() => import('../features/customer/blog/BlogPage.tsx'))
const BlogDetail = lazy(() => import('../features/customer/blog/BlogDetail.tsx'))

interface RouterProps {
  path: string
  component: React.FC | any
  params?: any
  layout?: any
}

export const adminRoutes: Array<RouterProps> = [
  {
    path: '',
    component: HomePage,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.OVERVIEW,
    component: AdminDashBoard,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.MANAGER,
    component: ManagerPage,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.UPLOAD,
    component: UploadFile,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.UPLOADS,
    component: UploadMultipartFile,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.CUSTOMER,
    component: CustomerPage,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.BUILDING,
    component: CategoryPage,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.ROOM,
    component: AdminProductPage,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.CREATE_UPDATE_ROOM,
    component: AdminProductForm,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.BLOG,
    component: BlogForm,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.CREATE_UPDATE_BLOG,
    component: AddEditBlogPage,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.ORDER,
    component: AdminOrderPage,
    layout: AdminLayout
  },
  {
    path: `${ADMIN_PATH.UPDATE_ORDER}/:id`,
    component: AdminEditOrder,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.ROOM_TYPE,
    component: RoomType,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.DEVICE,
    component: DevicePage,
    layout: AdminLayout
  },
  {
    path: ADMIN_PATH.VIEW_IMAGE,
    component: DevicePage,
    layout: RoomImageView
  }
]

export const userRoutes: Array<RouterProps> = [
  {
    path: USER_PATH.ORDER_SUCCESS,
    component: OrderSuccess
  }
]

export const publicRoutes: Array<RouterProps> = [
  {
    path: ADMIN_PATH.LOGIN,
    component: CustomerLoginPage
  },
  {
    path: USER_PATH.REGISTER,
    component: RegisterPage
  },
  {
    path: USER_PATH.PRODUCT,
    component: ProductPage,
    layout: UserLayout
  },
  {
    path: USER_PATH.PRODUCT_DETAIL + '/:id',
    component: ProductDetail,
    layout: UserLayout
  },
  {
    path: USER_PATH.CART,
    component: CartPage,
    layout: UserLayout
  },
  {
    path: USER_PATH.ORDER,
    component: OrderPage,
    layout: UserLayout
  },
  {
    path: USER_PATH.ORDER_HISTORY,
    component: OrderHistory,
    layout: UserLayout
  },
  {
    path: USER_PATH.BLOG,
    component: BlogPage,
    layout: UserLayout
  },
  {
    path: USER_PATH.BLOG + '/:id',
    component: BlogDetail,
    layout: UserLayout
  }
]
