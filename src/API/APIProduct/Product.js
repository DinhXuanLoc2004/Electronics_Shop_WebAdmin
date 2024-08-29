import IpConfig from "../helpers/IpConfig";

export async function AddProduct(body) {
    // Tạo một FormData object để chứa dữ liệu
    console.log("bode: ", body);
    const formData = new FormData();

    // Thêm từng thuộc tính của body vào formData
    for (const key in body) {
        if (key === 'images') {
            for (const image of body[key]) {
                formData.append('images', image, image.name)
            }
        } else {
            formData.append(key, body[key])
        }
    }

    try {
        const response = await fetch(`http://${IpConfig}:3000/api/product`, {
            method: 'POST',
            body: formData,
        });
        const metadata = await response.json();
        console.log('response', metadata);
        return metadata.status
    } catch (err) {
        console.log(err.message);
    }
}

export async function deleteProduct(_id) {
    try {
        const response = await fetch(`http://${IpConfig}:3000/api/product/${_id}`, {
            method: 'DELETE'
        })
        const metadata = await response.json()
        return metadata.status
    } catch (error) {
        console.log(error.message);
    }
}

export async function updateProduct(_id, body) {
    try {
        console.log('body: ', body);
        const formData = new FormData();

        // Thêm từng thuộc tính của body vào formData
        for (const key in body) {
            if (key === 'images') {
                for (const image of body[key]) {
                    formData.append('images', image, image.name)
                }
            } else {
                formData.append(key, body[key])
            }
        }
        const response = await fetch(`http://${IpConfig}:3000/api/product/${_id}`, {
            method: 'PUT',
            body: formData
        })
        const metadata = await response.json()
        console.log('metadata: ', metadata);
        return metadata.status
    } catch (error) {
        console.log(error.message);
    }
}