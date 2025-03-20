import * as yup from "yup";

export const ProdukValidation = yup.object({
  name: yup.string().required("Nama Produk harus diisi"),
  price: yup
    .number()
    .required("Harga Produk harus diisi")
    .min(2000, "Harga Produk minimal Rp. 2000"),
  typeCategory: yup.string().required("Kategori Produk harus diisi"),
  deskription: yup.string().required("Deskripsi harus diisi"),
  gambarProduct: yup.mixed().required("Gambar harus diunggah"),
});
