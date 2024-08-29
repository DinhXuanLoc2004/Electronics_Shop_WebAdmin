import IpConfig from "../helpers/IpConfig";

export async function AddCategory(body) {
    // Tạo một FormData object để chứa dữ liệu
    console.log("bode: ", body);
    const formData = new FormData();

    // Thêm từng thuộc tính của body vào formData
    for (const key in body) {
        if (key === 'thumb') {
            for (const image of body[key]) {
                formData.append('thumb', image, image.name)
            }
        } else {
            formData.append(key, body[key])
        }
    }

    try {
        const response = await fetch(`http://${IpConfig}:3000/api/category`, {
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

export async function deleteCategory(_id) {
    try {
        const response = await fetch(`http://${IpConfig}:3000/api/category/${_id}`, {
            method: 'DELETE'
        })
        const metadata = await response.json()
        return metadata.status
    } catch (error) {
        console.log(error.message);
    }
}

export async function updateCategory(_id, body) {
    try {
        console.log('body: ', body);
        console.log('_id: ', _id);
        const response = await fetch(`http://${IpConfig}:3000/api/category/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const metadata = await response.json()
        console.log('metadata: ', metadata);
        return metadata.status
    } catch (error) {
        console.log(error.message);
    }
}