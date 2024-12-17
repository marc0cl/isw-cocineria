import { deleteProduct } from '@services/inventory.service';
import { deleteDataAlert, showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';

const useDeleteProduct = (setProducts) => {
  const handleDelete = async (nombreProducto) => {
    try {
      const result = await deleteDataAlert();
      if (result.isConfirmed) {
        const response = await deleteProduct(nombreProducto); // Cambiado a usar nombreProducto
        if (response.status === 'Client error') {
          return showErrorAlert('Error', response.details);
        }
        showSuccessAlert('¡Eliminado!', 'El producto ha sido eliminado correctamente.');

        // Actualizar la lista de productos después de eliminar por nombreProducto
        setProducts((prevProducts) =>
          prevProducts.filter(product => product.nombreProducto !== nombreProducto)
        );
      } else {
        showErrorAlert('Cancelado', 'La operación ha sido cancelada.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      showErrorAlert('Cancelado', 'Ocurrió un error al eliminar el producto.');
    }
  };

  return { handleDelete };
};

export default useDeleteProduct;
