import React, { useState, useEffect } from 'react'
import { AddProduct, deleteProduct, updateProduct } from '../../API/APIProduct/Product'
import Swal from 'sweetalert2'
import { FixedSizeList } from 'react-window'
import IpConfig from '../../API/helpers/IpConfig'

function ProductManager() {
  const [valueShadow, setvalueShadow] = useState('10px 10px 20px rgba(0, 0, 0, 0)')
  const [isForm, setisForm] = useState(false)
  const [Images, setImages] = useState([])
  const [ImageFile, setImageFile] = useState([])
  const [Name, setName] = useState("")
  const [Price, setPrice] = useState(1)
  const [Stock, setStock] = useState(1)
  const [Description, setDescription] = useState("")
  const [CategoryID, setCategoryID] = useState("")
  const [Categories, setCategories] = useState([])
  const [listProducts, setlistProducts] = useState([])
  const [textClick, settextClick] = useState('')
  const [_id, set_id] = useState('')

  const getAllProduct = async () => {
    try {
      const response = await fetch(`http://${IpConfig}:3000/api/product`);
      const responseProducts = await response.json();
      if (responseProducts.status === false) {
        throw new Error('Network response was not ok');
      }
      setlistProducts(responseProducts.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const clickDeteleProduct = async ({ _id }, index) => {
    try {
      const _result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      });
      if (_result.isConfirmed) {
        const status = await deleteProduct(_id)
        if (status) {
          setlistProducts([...listProducts.toSpliced(index, 1)])
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Xóa sản phẩm thành công",
            showConfirmButton: false,
            timer: 1500
          });
          return
        } else {
          console.log('delete false');
        }
      }
    } catch (error) {
      console.log('delete false', error);
    }
  }


  const Row = ({ item, index }) => {
    const linkImg = item.product_images && item.product_images.length > 0 ? item.product_images[0].url : ""
    return (
      <div key={item._id} style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row', marginTop: 10, marginLeft: 10, alignItems: 'center' }}>
        <div style={{ width: '10%' }}>
          {linkImg !== "" && <img style={{ width: 50, height: 50, borderRadius: 15 }} src={linkImg} />}
        </div>

        <div style={{ width: '17%' }}>
          <span style={{ fontSize: 14 }}>
            {item.product_name}
          </span>
        </div>

        <div style={{ width: '15%' }}>
          <span style={{ fontSize: 14 }}>
            {item.product_price}
          </span>
        </div>

        <div style={{ width: '15%' }}>
          <span style={{ fontSize: 14 }}>
            {item.stock}
          </span>
        </div>

        <div className='containerContentDescription'>
          <span style={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 10 }}>
            {item.product_description}
          </span>
        </div>

        <div style={{ width: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 100 }}>
          <button style={{ background: 'red', marginRight: 10, borderRadius: 5, borderWidth: 0.5, color: 'white' }} onClick={() => { clickDeteleProduct({ _id: item._id }, index) }}>
            delete
          </button>
          <button style={{ background: 'blue', borderRadius: 5, borderWidth: 0.5, color: 'white' }} onClick={() => {
            set_id(item._id)
            setName(item.product_name)
            setPrice(item.product_price)
            setStock(item.stock)
            setDescription(item.product_description)
            setCategoryID(item.category_id)
            setImages(item.product_images.map(img => img.url))
            setisForm(true)
            settextClick('Update')
          }}>
            update
          </button>
        </div>
      </div>
    )
  };



  return (
    <div className='containerProductManager'>
      <div className='containerHeaderProductManager'>
        <span className='textHeaderProductManager'>
          Quản lý sản phẩm
        </span>

        <button className='styleBntAddProduct'
          style={{ boxShadow: `${valueShadow}` }}
          onMouseOut={() => { setvalueShadow('10px 10px 20px rgba(0, 0, 0, 0)') }}
          onMouseOver={() => { setvalueShadow('10px 10px 20px rgba(0, 0, 0, 0.5)') }}
          onClick={() => { setisForm(true); settextClick('Add Product') }}>
          Thêm sản phẩm
        </button>
      </div>

      <div className='containerProduct'>
        <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid black', padding: '10px 0', flexDirection: 'row', marginLeft: 15 }}>
          <div style={{ width: '10%' }}>Image</div>
          <div style={{ width: '17%' }}>Name</div>
          <div style={{ width: '15%' }}>Price</div>
          <div style={{ width: '13%' }}>Stock</div>
          <div style={{ width: '20%' }}>Description</div>
        </div>

        <div className='containerListProduct'>
          {listProducts.map((item, index) => Row({ item, index }))}
        </div>
      </div>

      {
        isForm && <Form
          value={[Images, ImageFile, Name, Price, Stock, Description, CategoryID, Categories, isForm, textClick, _id, getAllProduct]}
          setValue={[setImages, setImageFile, setName, setPrice, setStock, setDescription, setCategoryID, setCategories, setisForm, set_id]}
        />
      }
    </div >
  )
}

function Form({ value, setValue }) {
  const [Images, ImageFile, Name, Price, Stock, Description, CategoryID, Categories, isForm, textClick, _id, getAllProduct] = value
  const [setImages, setImageFile, setName, setPrice, setStock, setDescription, setCategoryID, setCategories, setisForm] = setValue
  const [isLoading, setisLoading] = useState(false)
  const [Error, setError] = useState()

  const clickAddProduct = async () => {
    try {
      if (!Name || !ImageFile.length === 0 || !Price || !Stock || !Description || !CategoryID) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Vui lòng nhập đầy đủ thông tin",
          showConfirmButton: true,
        });
        return;
      }

      const body = {
        product_name: Name,
        images: ImageFile,
        product_description: Description,
        product_price: Price,
        stock: Stock,
        category_id: CategoryID,
      }

      const response = await AddProduct(body)
      if (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Thêm sản phẩm thành công",
          showConfirmButton: false,
          timer: 1500
        });

        setisForm(!isForm)
        setName()
        setCategoryID()
        setDescription()
        setImages([])
        setImageFile([])
        setPrice()
        setStock()
        getAllProduct()
        return
      }

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Thêm sản phẩm thất bại",
        showConfirmButton: true,
      });
    } catch (error) {
      console.log('add error', error);
    }
  }
  function validateNumber(Number, setNumber, text) { Number <= 0 ? setNumber(1) : setNumber(text) }

  useEffect(() => {
    setisLoading(true)
    fetch(`http://${IpConfig}:3000/api/category`, { method: 'get' })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data)
        setisLoading(false)
      })
      .catch((err) => {
        setError(err)
        setisLoading(false)
      })
  }, [])

  const clickUpdateProduct = async () => {
    try {
      if (!Name || !Price || !Stock || !Description || !CategoryID) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Vui lòng nhập đầy đủ thông tin",
          showConfirmButton: true,
        });
        return;
      }
      const body = {
        product_name: Name,
        product_description: Description,
        product_price: Price,
        stock: Stock,
        category_id: CategoryID,
        images: ImageFile
      }

      const response = await updateProduct(_id, body)
      if (response) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Sửa sản phẩm thành công",
          showConfirmButton: false,
          timer: 1500
        });

        setisForm(false)
        setName()
        setCategoryID()
        setDescription()
        setImages([])
        setPrice()
        setStock()
        getAllProduct()
        return
      }

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sửa sản phẩm thất bại",
        showConfirmButton: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const onClickHandel = () => { textClick !== null && textClick === 'Add Product' ? clickAddProduct() : clickUpdateProduct() }

  return (
    <div className='containerForm'>
      <span className='textHeaderForm'>
        FORM PRODUCT
      </span>

      <div className='containerInputImgs'>
        <label className="form-label">Image: </label>
        <input
          type='file'
          className='form-control'
          id='inputImage'
          multiple
          onChange={(images) => {
            const imgs = Array.from(images.target.files).map(file => URL.createObjectURL(file));
            const imgsFile = Array.from(images.target.files);
            setImages(prevImages => [...prevImages, ...imgs]);
            setImageFile(prevImages => [...prevImages, ...imgsFile]);
            console.log(imgsFile);
          }}
        />

        {
          <div className='containerListImgForm'>
            {Images.length > 0 && Images.map((item, index) => (
              <div key={index} className='containerFileImg'>
                <img src={item} alt="" className='imgForm' />
                <button onClick={() => {
                  const newImages = [...Images];
                  newImages.splice(index, 1);
                  setImages(newImages);
                }} className='buttonRemoveImage'>x</button>
              </div>
            ))}
          </div>
        }
      </div>

      <div className='containerInput'>
        <label className="textLable">Name Product: </label>
        <input
          type='text'
          className='inputForm'
          multiple
          value={Name || ''}
          onChange={(text) => { setName(text.target.value) }}
        />
      </div>

      <div className='containerInput'>
        <label className="textLable">Price: </label>
        <div className='containerInputPrice'>
          <input
            type='number'
            className='inputNumberForm'
            multiple
            value={Price || setPrice(1)}
            onChange={(text) => { validateNumber(Price, setPrice, text.target.value) }}
          />
          <label className="textPrice">$</label>
        </div>
      </div>

      <div className='containerInput'>
        <label className="textLable">Stock: </label>
        <input
          type='number'
          className='inputNumberForm'
          multiple
          value={Stock || setStock(1)}
          onChange={(text) => { validateNumber(Stock, setStock, Number(text.target.value)) }}
        />
      </div>

      <div className='containerInput'>
        <label className='textLable'>Category: </label>
        {
          isLoading ? (
            <p>Loading categories...</p>
          ) : Error ? (
            <p>Error loading categories {Error}</p>
          ) : (
            <select
              className='inputForm'
              value={CategoryID || ''}
              onChange={e => setCategoryID(e.target.value)}
            >
              <option value=''>Select a Category</option>
              {
                Categories.map((category, index) => (
                  <option key={index} value={category._id}>{category.category_name}</option>
                ))
              }
            </select>
          )
        }
      </div>

      <div className='containerInput'>
        <label className="textLable">Description: </label>
        <input
          type='text'
          className='inputFormDescription'
          multiple
          value={Description || ''}
          onChange={(text) => { setDescription(text.target.value) }}
        />
      </div>

      <div style={{ width: '100%', marginTop: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <button style={{ width: '100%', padding: 7, borderRadius: 7, borderWidth: 0.5, marginRight: 10 }}
          onClick={() => {
            setisForm(false)
            setName()
            setCategoryID()
            setDescription()
            setImages([])
            setImageFile([])
            setPrice()
            setStock()
          }}>
          <span>
            Cancle
          </span>
        </button>

        <button style={{ width: '100%', padding: 7, borderRadius: 7, borderWidth: 0.5, background: '#00ff00' }}
          onClick={onClickHandel}>
          <span>
            {textClick}
          </span>
        </button>
      </div>
    </div>
  )
}

export default ProductManager
