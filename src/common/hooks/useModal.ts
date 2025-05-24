import { useState, useCallback, ReactNode } from 'react'

interface UseModalOptions {
  onOk?: () => Promise<void> | void
  onCancel?: () => void
  content?: ReactNode
  title?: string
  width?: number
  destroyOnClose?: boolean
  okText?: string
  cancelText?: string
  centered?: boolean
  maskClosable?: boolean
}

interface ModalState {
  visible: boolean
  loading: boolean
  content?: ReactNode
  title?: string
  width?: number
  destroyOnClose?: boolean
}

export function useModal(defaultOptions: UseModalOptions = {}) {
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    loading: false,
    content: defaultOptions.content,
    title: defaultOptions.title,
    width: defaultOptions.width,
    destroyOnClose: defaultOptions.destroyOnClose
  })

  const showModal = useCallback((options: Partial<UseModalOptions> = {}) => {
    setModalState((prev) => ({
      ...prev,
      visible: true,
      content: options.content || prev.content,
      title: options.title || prev.title,
      width: options.width || prev.width,
      destroyOnClose: options.destroyOnClose ?? prev.destroyOnClose
    }))
  }, [])

  const hideModal = useCallback(() => {
    setModalState((prev) => ({
      ...prev,
      visible: false,
      loading: false
    }))
  }, [])

  const handleOk = useCallback(async () => {
    if (defaultOptions.onOk) {
      try {
        setModalState((prev) => ({ ...prev, loading: true }))
        await defaultOptions.onOk()
        hideModal()
      } catch (error) {
        console.error('Modal onOk error:', error)
      } finally {
        setModalState((prev) => ({ ...prev, loading: false }))
      }
    } else {
      hideModal()
    }
  }, [defaultOptions.onOk, hideModal])

  const handleCancel = useCallback(() => {
    defaultOptions.onCancel?.()
    hideModal()
  }, [defaultOptions.onCancel, hideModal])

  const updateModalContent = useCallback((content: ReactNode) => {
    setModalState((prev) => ({ ...prev, content }))
  }, [])

  return {
    showModal,
    hideModal,
    updateModalContent,
    modalState,
    modalProps: {
      open: modalState.visible,
      confirmLoading: modalState.loading,
      onOk: handleOk,
      onCancel: handleCancel,
      title: modalState.title,
      width: modalState.width,
      destroyOnClose: modalState.destroyOnClose,
      okText: defaultOptions.okText,
      cancelText: defaultOptions.cancelText,
      centered: defaultOptions.centered,
      maskClosable: defaultOptions.maskClosable,
      children: modalState.content
    }
  }
}

// Example usage:
/*
const MyComponent = () => {
  const { showModal, modalProps } = useModal({
    title: 'Default Title',
    width: 600,
    onOk: async () => {
      // Handle OK click
    }
  })

  return (
    <>
      <Button onClick={() => showModal({ content: <div>Custom Content</div> })}>
        Open Modal
      </Button>
      <Modal {...modalProps} />
    </>
  )
}
*/
