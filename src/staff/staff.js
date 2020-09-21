const conn = require('../../config/database')
const router = require('express').Router()

const path = require('path')
const multer = require('multer')
const sharp = require('sharp')

const jwt = require('jsonwebtoken')
const auth = require('../../config/auth/index')
const bcrypt = require('bcryptjs')


// ktp_image
const ktpImageDirectory = path.join(__dirname, '../assets/ktp_image')
// store_image
const storeImageDirectory = path.join(__dirname, '../assets/store_image')
// sign_image
const signatureImageDirectory = path.join(__dirname, '../assets/signature_image')

const upload = multer({
    limits: {
        fileSize: 10000000
    },
    fileFilter(req,file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload image file (jpg, jpeg, or png'))
        }
        cb(undefined, true)
    }
})

//////////////////////////////////
// PATCH UPDATE DATA KTP IMAGE //
////////////////////////////////
// Sudah Bisa postman frontend
router.patch('/merchant/update/ktpimage', upload.single('ktpimage'), async(req,res) =>{
    try{
        const filename = `${req.body.store_name}-ktp.png`
        const sql = `UPDATE table_merchant SET KTP_image = "${filename}", approval = "${req.body.approval}" WHERE staff_id = ${req.body.staff_id} and id = ${req.body.id} `
      
        await sharp(req.file.buffer).resize(200).png().toFile(`${ktpImageDirectory}/${filename}`)

        conn.query(sql, (err,result) =>{
            if(err) return res.status(500).send({err: err.sqlMessage})
            res.status(200).send({message: filename})
        })
    } catch (error){
        res.status(500).send(error)
    }
}, (err, req,res,next) =>{
    res.status(400).send(err.message)
})

////////////////////////////////////
// PATCH UPDATE DATA STORE IMAGE //
//////////////////////////////////
// Sudah Bisa Postman Frontend
router.patch('/merchant/update/storeimage', upload.single('storeimage'), async(req,res) =>{
    try {
        const filename = `${req.body.store_name}-store.png`
        const sql = `UPDATE table_merchant SET store_image = "${filename}", approval = "${req.body.approval}" WHERE staff_id = ${req.body.staff_id} AND id = ${req.body.id}`
        await sharp(req.file.buffer).resize(200).png().toFile(`${storeImageDirectory}/${filename}`)

        conn.query(sql, (err,result) =>{
            if(err) return res.status(500).send({err: sqlMessage})
            res.status(200).send({message:filename})
        })
    } catch (error){
        res.status(500).send(error)
    }
}, (err, req,res,next) =>{
    res.status(400).send(err.message)
})

////////////////////////////////////////
// PATCH UPDATE DATA SIGNATURE IMAGE //
//////////////////////////////////////
// Sudah Bisa Postman Frontend
router.patch('/merchant/update/signature', upload.single('signatureimage'), async(req,res) =>{
    try {
        const filename = `${req.body.store_name}-signature.png`
        const sql = `UPDATE table_merchant SET signature_image = "${filename}", approval = "${req.body.approval}" WHERE staff_id = ${req.body.staff_id} AND id = ${req.body.id}`
        await sharp(req.file.buffer).resize(200).png().toFile(`${signatureImageDirectory}/${filename}`)

        conn.query(sql, (err,result) =>{
            if(err) return res.status(500).send({err: sqlMessage})
            res.status(200).send({message:filename})
        })
    } catch (error){
        res.status(500).send(error)
    }
}, (err, req,res,next) =>{
    res.status(400).send(err.message)
})


// ------------------------------- START ADD DATA FIRST TIME ------------------------------- //
///////////////////////////////////////////////////////
// GET LAST DATA AFTER ADD DATA FIRST TIME PER SALES//
/////////////////////////////////////////////////////
// sudah bisa postman front end AddImage.jsx
router.get('/merchant/lastdata/sales/:id', (req,res) =>{
    // Ambil nama toko buat menjadi nama file ktp di data terakhir berdasarkan id
    const sqlRead = `Select * FROM table_merchant WHERE staff_id = ${req.params.id} ORDER BY id DESC LIMIT 1`

    conn.query(sqlRead, (err,result) =>{
        if(err) return res.status(500).send(err)

        res.status(200).send(result[0])
    })
})

///////////////////////////////////////////////
// POST KTP IMAGE AFTER ADD DATA FIRST TIME //
/////////////////////////////////////////////
// sudah bisa postman frontend AddImage.jsx
router.patch('/merchant/firstadd/ktpimage',  upload.single('ktpimage'), async(req,res) =>{
    try {

        const v2StoreName = req.body.store_name.replace(/\s/g, '')

        const filename = `${v2StoreName}-ktp_image.png`        
        const sql = `UPDATE table_merchant SET KTP_image = "${filename}" WHERE staff_id = ${req.body.staff_id} AND store_name = "${req.body.store_name}" ORDER BY id DESC LIMIT 1`
 
        console.log(filename);
        console.log(req.body.staff_id);
        console.log(req.body.store_name);
        await sharp(req.file.buffer).resize(200).png().toFile(`${ktpImageDirectory}/${filename}`)

        conn.query(sql,(err,result) =>{
            if(err) return res.status(500).send(err.message)
            res.status(200).send(result)
        })
    } catch (error){
        res.status(500).send(error.message)
    }
}, (err, req,res,next) =>{
    res.status(400).send(err.message)
})

///////////////////////////////////////////////
// POST STORE IMAGE AFTER ADD DATA FIRST TIME //
/////////////////////////////////////////////
// sudah bisa postman frontend AddImage.jsx
router.patch('/merchant/firstadd/storeimage', upload.single('storeimage'), async(req,res) =>{
    try {

        const v2StoreName = req.body.store_name.replace(/\s/g, '')
        const filename = `${v2StoreName}-store_image.png`        
        const sql = `UPDATE table_merchant SET store_image = "${filename}" WHERE staff_id = ${req.body.staff_id} AND store_name = "${req.body.store_name}" ORDER BY id DESC LIMIT 1`
 
        await sharp(req.file.buffer).resize(200).png().toFile(`${storeImageDirectory}/${filename}`)

        conn.query(sql,(err,result) =>{
            if(err) return res.status(500).send(err.message)
            res.status(200).send(result)
        })
    } catch (error){
        res.status(500).send(error.message)
    }
}, (err, req,res,next) =>{
    res.status(400).send(err.message)
})

/////////////////////////////////////////////////////
// POST SIGNATURE IMAGE AFTER ADD DATA FIRST TIME //
///////////////////////////////////////////////////
// sudah bisa postman frontend AddImage.jsx
router.patch('/merchant/firstadd/signatureimage',  upload.single('signatureimage'), async(req,res) =>{
    try {
        const v2StoreName = req.body.store_name.replace(/\s/g, '')
        const filename = `${v2StoreName}-signature_image.png`        
        const sql = `UPDATE table_merchant SET signature_image = "${filename}" WHERE staff_id = ${req.body.staff_id} AND store_name = "${req.body.store_name}" ORDER BY id DESC LIMIT 1`
 
        await sharp(req.file.buffer).resize(200).png().toFile(`${signatureImageDirectory}/${filename}`)

        conn.query(sql,(err,result) =>{
            if(err) return res.status(500).send(err.message)
            res.status(200).send(result)
        })
    } catch (error){
        res.status(500).send(error.message)
    }
}, (err, req,res,next) =>{
    res.status(400).send(err.message)
})

// ------------------------------- FINISH ADD DATA FIRST TIME ------------------------------- //

/////////////////////
// READ KTP IMAGE //
///////////////////
// sudah bisa postman frontend DetailMerchant.jsx
router.get('/merchant/read/ktpimage/:filename', (req, res) => {
    let options = {
        root: ktpImageDirectory
    };

    let filename = req.params.filename;

    res.status(200).sendFile(filename, options, function(err) {
        if(err) {
            return res.status(404).send({message: 'Gambar tidak ditemukan'})
        }
    });
})

///////////////////////
// READ STORE IMAGE //
/////////////////////
// sudah bisa postman frontend DetailMerchant.jsx
router.get('/merchant/read/storeimage/:filename', (req, res) => {
    let options = {
        root: storeImageDirectory
    };

    let filename = req.params.filename;

    res.status(200).sendFile(filename, options, function(err) {
        if(err) {
            return res.status(404).send({message: 'Gambar tidak ditemukan'})
        }
    });
})

///////////////////////////
// READ SIGNATURE IMAGE //
/////////////////////////
// sudah bisa postman frontend DetailMerchant.jsx
router.get('/merchant/read/signatureimage/:filename', (req, res) => {
    let options = {
        root: signatureImageDirectory
    };

    let filename = req.params.filename;

    res.status(200).sendFile(filename, options, function(err) {
        if(err) {
            return res.status(404).send({message: 'Gambar tidak ditemukan'})
        }
    });
})



//------------------------------------------------------------------------------------------ ------ ------------------------------------------------------------------------\\ 
//------------------------------------------------------------------------------------------ LEADER ------------------------------------------------------------------------\\ 
//------------------------------------------------------------------------------------------ ------ ------------------------------------------------------------------------\\ 

///////////////////////////////
// READ ALL MERCHANT LEADER //
/////////////////////////////
// Sudah Bisa di Postman frontend MerchantData.jsx folder Leader
router.get('/merchant/leader/read',  (req,res) =>{
    const sql = `SELECT tm.id, tm.staff_id, tm.date_created,
    tm.store_name, tm.category_id, tc.category, tm.store_image
    FROM table_merchant tm JOIN table_category tc ON tm.category_id = tc.id`

    conn.query(sql, (err, result) =>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).send(result)
    })
})

/////////////////////////////////////////////////
// READ ALL MERCHANT LEADER ONLY NOT APPROVAL //
///////////////////////////////////////////////
// Sudah Bisa di Postman Frontend ListNotApproval.jsx folder leader
router.get('/merchant/leader/read/notapproval',  (req,res) =>{
    const sql = `SELECT merch.id, merch.staff_id, staff.staff_id, staff.name,
    merch.date_created, merch.store_name, cat.category, merch.category_id, merch.address,
    merch.mobile_number, merch.location, merch.approval, merch.KTP_image, merch.store_image, merch.signature_image
    FROM table_merchant as merch
    JOIN table_staff as staff 
    ON merch.staff_id = staff.id JOIN table_category as cat ON merch.category_id = cat.id WHERE approval = 0;`

    conn.query(sql, (err, result) =>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).send(result)
    })
})

/////////////////////////////
// DELETE MERCHANT LEADER //
///////////////////////////
// sudah bisa Postman Frontend MerchantData.jsx folder leader
router.delete('/merchant/leader/delete/:id',  (req,res) =>{
    const data = {id: req.params.id}
    const sql = `DELETE FROM table_merchant WHERE ?`
   
    conn.query(sql, data, (err,result) =>{
        if (err) {
            return res.status(500).send(err.sqlMessage)
        }
        res.status(200).send({message: "merchant berhasil di hapus", result})
    })
})

////////////////////////////////
// INSERT STAFF ID BY LEADER //
//////////////////////////////
// Sudah Bisa Postman Frontend InputStaff.jsx folder Leader
router.post('/leader/insert/staffid',  (req,res) =>{
    const sql = `INSERT INTO table_staff SET staff_id = ?`
    const data = req.body.staff_id 

    conn.query(sql, data, (err,result) =>{
        if (err) {
            return res.send(err)
        }
        res.send({message: 'Register Berhasil', result})
    })
})

////////////////////////////////////
// GIVE APPROVAL OR NOT APPROVAL //
//////////////////////////////////
// Sudah Bisa di Postman Frontend UpdateMerchantLeader.jsx folder leader
router.patch('/merchant/leader/update/approval/:id',  (req,res)=>{
    const sql = `UPDATE table_merchant SET approval = ? WHERE id = ?`
    const data = [req.body.approval, req.params.id]

    conn.query(sql,data, (err, result) =>{
        if(err){
            return res.status(500).send(err.sqlMessage)
        }
        res.status(200).send({message: "Approval berhasil di ubah", result})
    })
})


///////////////////////////////
// READ ALL SALES DATA //
/////////////////////////////
// Sudah Bisa di Postman FrontEnd SalesData folder leader
router.get('/merchant/leader/read/salesdata',  (req,res) =>{
    const sql = `SELECT * from table_staff`

    conn.query(sql, (err, result) =>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).send(result)
    })
})

//////////////////////////////
// FILTERING ID SALES DATA //
////////////////////////////
// Sudah Bisa Di Postman Frontend SalesData.jsx folder leader
router.get('/merchant/leader/filter/:idsales',  (req,res) =>{
    const sql = `SELECT staff_id, name, email, phone_number from table_staff WHERE staff_id = ${req.params.idsales} `

    conn.query(sql, (err, result) =>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).send(result)
    })
})

////////////////////////////////////
// COUNT MERCHANT PER SALES DATA //
//////////////////////////////////
// Sudah Bisa di Postman 
router.get('/merchant/leader/read/countmerchantsales/:staff_id',  (req,res) =>{
    const sql = `SELECT count(*) as merchant FROM table_merchant WHERE staff_id = ${req.params.staff_id}`

    conn.query(sql, (err, result) =>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).send(result)
    })
})


//------------------------------------------------------------------------------------------ ----- ------------------------------------------------------------------------\\ 
//------------------------------------------------------------------------------------------ SALES ------------------------------------------------------------------------\\ 
//------------------------------------------------------------------------------------------ ----- ------------------------------------------------------------------------\\ 

///////////////////////////
// READ ID FROM STAFF_ID//
/////////////////////////
// Sudah bisa di postman frontend AddImage.jsx AddText.jsx
router.get('/sales/read/id/:staff_id', (req,res) =>{

    // mendapatkan id = 10 dari staff_id = 4444
    const getId = `SELECT id FROM table_staff WHERE staff_id = ${req.params.staff_id}`

    conn.query(getId, (err,result) =>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).send(result[0])
    })
})

////////////////////////////////
// READ ALL MERCHANT PER SALES//
////////////////////////////////
// sudah bisa postman frontend MerchantData.jsx
router.get('/merchant/sales/read/:staff_id', (req,res) =>{

    const getStaffId = `SELECT id FROM table_staff WHERE staff_id = ${req.params.staff_id}`
    
    conn.query(getStaffId, (err, result) =>{
        if(err){
            return res.status(500).send(err)
        }
        
        let id = result[0].id
        
        const sql = `SELECT tm.id, tm.staff_id, tm.date_created,
        tm.store_name, tm.category_id, tc.category, tm.store_image
        FROM table_merchant tm JOIN table_category tc ON tm.category_id = tc.id WHERE staff_id = ${id}`

        conn.query(sql, (err,result) =>{
            if(err){
                return res.status(500).send(err)
            }
            res.status(200).send(result)

        })
    })
})

/////////////////////////////////////////
// INSERT DATA TEXT MERCHANT BY SALES //
///////////////////////////////////////
// sudah selesai di postman frontend AddText.jsx
router.post('/merchant/sales/insert', (req,res) =>{

        const sql = `INSERT INTO table_merchant SET 
        staff_id = ?, date_created = ?,
        store_name = ?, category_id = ?,
        address = ?, mobile_number = ?,
        location = ?, approval = ? `
    
        const dataFinal = [ req.body.staff_id, req.body.date_created, req.body.store_name,
            req.body.category_id, req.body.address, req.body.mobile_number, req.body.location, req.body.approval]

        conn.query(sql, dataFinal, (err,result) =>{
            if(err) return res.status(500).send(err)

            res.status(200).send({message: "Penambahan Product Berhasil", result})
        })
})

/////////////////////////////////////////
// UPDATE DATA TEXT MERCHANT BY SALES //
///////////////////////////////////////
// Sudah bisa Postman frontend UpdateMerchant.jsx
router.patch('/merchant/sales/update', (req,res) =>{

    const sql = `UPDATE table_merchant SET 
    staff_id = ?,
    store_name = ?, category_id = ?,
    address = ?, mobile_number = ?,
    location = ?, approval = ? WHERE staff_id = ${req.body.staff_id} AND id = ${req.body.id} `

    const dataFinal = [ req.body.staff_id, req.body.store_name,
        req.body.category_id, req.body.address, req.body.mobile_number,
        req.body.location, req.body.approval ]

    conn.query(sql, dataFinal, (err,result) =>{
        if(err) return res.status(500).send(err)
        res.status(200).send({message: "UPDATE Merchant Berhasil", result})
    })
})

/////////////////////////////
// DELETE MERCHANT BY SALES //
///////////////////////////
// butuh 
// Sudah bisa di postman frontend MerchantData.jsx sales
router.delete('/merchant/sales/delete/:id/:staff_id',  (req,res) =>{
    const sql = `DELETE FROM table_merchant WHERE id = ? AND staff_id = ?`
    const data = [req.params.id, req.params.staff_id]

    conn.query(sql, data, (err,result) =>{
        if (err) {
            return res.status(500).send(err.sqlMessage)
        }
        res.status(200).send({message: "merchant berhasil di hapus", result})
    })
})


////////////////////////
// READ ALL CATEGORY //
//////////////////////
// Sudah Bisa Postmant Frontend AddText.jsx UpdateMerchant.jsx
router.get('/read/allcategory', (req,res) =>{
    const sql = `SELECT * FROM table_category`

    conn.query(sql, (err,result) =>{
        if(err) return res.send(500).send(err)
        res.status(200).send(result)
    })
})



/////////////////////
// REGISTER STAFF //
///////////////////
// sudah bisa postman frontend Register.jsx
router.post('/register_staff', (req, res) => {
    const sql = `Select * from table_staff where staff_id = ${req.body.staff_id} and status = 1 `
    
    conn.query(sql, (err, result) => {
      if(err) return res.status(500).send(err)
      
      if(result  < 1) return res.status(200).send({message:"staff id tidak di temukan"})
       
      const sql2 = `UPDATE table_staff SET ? WHERE staff_id = ? `
      const data = req.body
      data.password = bcrypt.hashSync(data.password, 8)
      const dataUpdate = [data,data.staff_id]
   
      conn.query(sql2,dataUpdate, (err, result2) => {
         if(err){
             console.log(err)
             return res.status(500).send(err)
         } 
         res.status(201).send({message : 'berhasil registrasi'})

      })
    })
})

///////////////////////////
// LOGIN STAFF & LEADER //
/////////////////////////
// Sudah Bisa Postman Frontend Login.jsx
router.post('/login_staff', (req, res) => {
   const {email, password} = req.body

   const sql = `SELECT * FROM table_staff WHERE email = '${email}'`
   const sql2 = `INSERT INTO table_tokens SET ?`
   
   conn.query(sql, (err, result) => {
      // Cek error
      if(err) return res.status(500).send(err)

      // result = [ {} ]
      let user = result[0]
      console.log(user);
   
      // Jika username tidak ditemukan
      if(!user) return res.status(404).send({message: 'username tidak ditemukan'})
      // Verifikasi password
      let validPassword = bcrypt.compareSync(password, user.password)
      // Jika user memasukkan password yang salah
      if(!validPassword) return res.status(400).send({message: 'password tidak valid'})
      // Verikasi status verified
      let token = jwt.sign({ id: user.staff_id}, 'secret_key')
      
      // Property user_id dan token merupakan nama kolom yang ada di tabel 'tokens'
      const data = {staff_id : user.staff_id, token : token}

      conn.query(sql2, data, (err, result) => {
         if(err) return res.status(500).send(err)
         
         // Menghapus beberapa property
         delete user.password
         // delete user.avatar
         // delete user.verified
         const sql3 = `UPDATE table_staff SET token_id = ${result.insertId}
          WHERE staff_id = ${user.staff_id} `
         conn.query(sql3)
         res.status(200).send({
            message: 'Login berhasil',
            user,
            token
         })
      })
   })
})

////////////////////////////
// LOGOUT STAFF & LEADER //
//////////////////////////
// Sudah bisa Postman Frontend Home.jsx
router.delete('/logout_staff', (req,res) => {
    const sql = `DELETE FROM table_staff WHERE staff_id = ${req.user.staff_id}`

    conn.query(sql, (err, result) => {
        if(err) return res.status(500).send(err)
        
       res.status(200).send({
          message : "delete berhasil",
          result
       })
     })
})

//////////////////////
// DETAIL MERCHANT //
////////////////////
// sudah bisa postman MerchantData.jsx MerchantData.jsx DetailMerchant.jsx 
router.get('/detailmerchant/:id', (req,res) =>{
    const sql = `SELECT * FROM table_merchant WHERE id = ${req.params.id}`
    conn.query(sql, (err,result) =>{
        if(err) return res.send(500).send(err)
        res.status(200).send(result)
    })
})

module.exports = router