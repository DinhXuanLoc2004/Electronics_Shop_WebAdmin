import React, { useState, useEffect } from 'react'
import { AddCategory, deleteCategory, updateCategory } from '../../API/APIProduct/Category'
import Swal from 'sweetalert2'
import IpConfig from '../../API/helpers/IpConfig'

function CategoriesManager() {
    const [valueShadow, setvalueShadow] = useState('10px 10px 20px rgba(0, 0, 0, 0)')
    const [isForm, setisForm] = useState(false)
    const [textClick, settextClick] = useState('')
    const [listCategories, setlistCategories] = useState([])
    const [name_category, setname_category] = useState('')
    const [Images, setImages] = useState([])
    const [ImageFile, setImageFile] = useState([])
    const [_id, set_id] = useState('')

    const getAllCategory = async () => {
        try {
            const response = await fetch(`http://${IpConfig}:3000/api/category`);
            const responseCategories = await response.json();
            if (responseCategories.status === false) {
                throw new Error('Network response was not ok');
            }
            setlistCategories(responseCategories.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCategory()
    }, [])

    const clickDeteleCategory = async ({ _id }, index) => {
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
                const status = await deleteCategory(_id)
                if (status) {
                    setlistCategories([...listCategories.toSpliced(index, 1)])
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
        const linkImg = item.thumb && item.thumb.length > 0 ? item.thumb[0].url : ""
        return (
            <div key={item._id} style={{ width: '100%', height: 50, display: 'flex', flexDirection: 'row', marginTop: 10, marginLeft: 10, alignItems: 'center' }}>
                <div style={{ width: '20%' }}>
                    {linkImg !== "" && <img style={{ width: 50, height: 50, borderRadius: 15 }} src={linkImg} />}
                </div>

                <div style={{ width: '17%' }}>
                    <span style={{ fontSize: 14 }}>
                        {item.category_name}
                    </span>
                </div>

                <div style={{ width: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 100 }}>
                    <button style={{ background: 'red', marginRight: 10, borderRadius: 5, borderWidth: 0.5, color: 'white' }} onClick={() => {
                        clickDeteleCategory({ _id: item._id }, index)
                    }}>
                        delete
                    </button>
                    <button style={{ background: 'blue', borderRadius: 5, borderWidth: 0.5, color: 'white' }} onClick={() => {
                        setisForm(true)
                        settextClick('Update')
                        setname_category(item.category_name)
                        setImages(item.thumb ? item.thumb.map(img => img.url) : [])
                        set_id(item._id)
                    }}>
                        update
                    </button>
                </div>
            </div>
        )
    };


    return (
        <div className='containerCategoriesManager'>
            <div className='containerHeaderProductManager'>
                <span className='textHeaderProductManager'>
                    Quản lý loại sản phẩm
                </span>

                <button className='styleBntAddProduct'
                    style={{ boxShadow: `${valueShadow}` }}
                    onMouseOut={() => { setvalueShadow('10px 10px 20px rgba(0, 0, 0, 0)') }}
                    onMouseOver={() => { setvalueShadow('10px 10px 20px rgba(0, 0, 0, 0.5)') }}
                    onClick={() => { setisForm(true); settextClick('Add') }}>
                    Thêm loại sản phẩm
                </button>
            </div>

            <div className='containerProduct'>
                <div style={{ display: 'flex', width: '100%', borderBottom: '1px solid black', padding: '10px 0', flexDirection: 'row', marginLeft: 15 }}>
                    <div style={{ width: '20%' }}>Thumb</div>
                    <div style={{ width: '17%' }}>Name Category</div>
                </div>

                <div className='containerListProduct'>
                    {listCategories.map((item, index) => Row({ item, index }))}
                </div>
            </div>

            {
                isForm && <Form
                    value={[Images, ImageFile, name_category, _id, getAllCategory, textClick, isForm]}
                    setValue={[setImages, setImageFile, setname_category, set_id, settextClick, setisForm]}
                />
            }
        </div >
    )
}

function Form({ value, setValue }) {
    const [Images, ImageFile, name_category, _id, getAllCategory, textClick, isForm] = value
    const [setImages, setImageFile, setname_category, set_id, settextClick, setisForm] = setValue
    const [isLoading, setisLoading] = useState(false)
    const [Error, setError] = useState()
    const clickAddCategory = async () => {
        try {
            if (!name_category || ImageFile.length === 0) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Vui lòng nhập đầy đủ thông tin",
                    showConfirmButton: true,
                });
                return;
            }

            const body = {
                name: name_category,
                thumb: ImageFile
            }

            const response = await AddCategory(body)
            if (response) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Thêm sản phẩm thành công",
                    showConfirmButton: false,
                    timer: 1500
                });

                setisForm(false)
                setname_category('')
                setImageFile([])
                setImages([])
                getAllCategory()
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

    const clickUpdateCategory = async () => {
        try {
            if (!name_category) {
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Vui lòng nhập đầy đủ thông tin",
                    showConfirmButton: true,
                });
                return;
            }
            const body = {
                name: name_category,
            }

            const response = await updateCategory(_id, body)
            if (response) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Sửa loại sản phẩm thành công",
                    showConfirmButton: false,
                    timer: 1500
                });

                setisForm(false)
                setname_category('')
                setImageFile([])
                setImages([])
                getAllCategory()
                return
            }

            Swal.fire({
                position: "center",
                icon: "error",
                title: "Sửa loại sản phẩm thất bại",
                showConfirmButton: true,
            });
        } catch (err) {
            console.log(err);
        }
    }

    const onClickHandel = () => { textClick !== null && textClick === 'Add' ? clickAddCategory() : clickUpdateCategory() }

    return (
        <div className='containerForm'>
            <span className='textHeaderForm'>
                FORM CATEGORY
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
                <label className="textLable">Name Category: </label>
                <input
                    type='text'
                    className='inputForm'
                    multiple
                    value={name_category}
                    onChange={(text) => { setname_category(text.target.value) }}
                />
            </div>

            <div style={{ width: '100%', marginTop: 30, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <button style={{ width: '100%', padding: 7, borderRadius: 7, borderWidth: 0.5, marginRight: 10 }}
                    onClick={() => {
                        setisForm(false)
                        setname_category('')
                        setImageFile([])
                        setImages([])
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

export default CategoriesManager