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

/////////////////////
// POST KTP IMAGE //
///////////////////
// belum bisa
// butuh 
router.post('/merchant/ktp', upload.single('ktp'), async(req,res) =>{
    try{
        const sql = `UPDATE table_merchant SET ktp_image = ? values ?`
        const filename = `${req.merchant.storename}-ktp.png`
        const data = [filename, req.merchant.storename]
        await sharp(req.file.buffer).resize(200).png().toFile(`${ktpImageDirectory}/${filename}`)

        conn.query(sql, data, (err,result) =>{
            if(err) return res.status(500).send({err: err.sqlMessage})
            res.status(200).send({message: filename})
        })
    } catch (error){
        res.status(500).send(error)
    }
}, (err, req,res,next) =>{
    res.status(400).send(err.message)
})

///////////////////////
// POST STORE IMAGE //
/////////////////////
// belum bisa
router.post('/merchant/store', upload.single('store'), async(req,res) =>{
    try {
        const sql = `insert into merchant (store_image) values ?`
        const filename = `${req.merchant.storename}-store.png`
        const data = [filename, req.merchant.storename]
        await sharp(req.file.buffer).resize(200).png().toFile(`${storeImageDirectory}/${filename}`)

        conn.query(sql, data,(err,result) =>{
            if(err) return res.status(500).send({err: sqlMessage})
            res.status(200).send({message:filename})
        })
    } catch (error){
        res.status(500).send(error)
    }
}, (err, req,res,next) =>{
    res.status(400).send(err.message)
})

///////////////////////////
// POST SIGNATURE IMAGE //
/////////////////////////
// belum bisa
router.post('/merchant/signature', upload.single('signature'), async(req,res) =>{
    try {
        const sql = `insert into merchant (signature_image) values ?`
        const filename = `${req.merchant.storename}-signature.png`
        const data = [filename, req.merchant.storename]
        await sharp(req.file.buffer).resize(200).png().toFile(`${signatureImageDirectory}/${filename}`)

        conn.query(sql, data,(err,result) =>{
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
// sudah bisa
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
// sudah bisa
// butuh 
router.patch('/merchant/firstadd/ktpimage',  upload.single('ktpimage'), async(req,res) =>{
    try {

        const filename = `${req.body.store_name}-ktp_image.png`        
        const sql = `UPDATE table_merchant SET KTP_image = "${filename}" WHERE staff_id = ${req.body.staff_id} AND store_name = "${req.body.store_name}" ORDER BY id DESC LIMIT 1`
 
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
// sudah bisa
// butuh 
router.patch('/merchant/firstadd/storeimage', upload.single('storeimage'), async(req,res) =>{
    try {

        const filename = `${req.body.store_name}-store_image.png`        
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
// sudah bisa
// butuh 
router.patch('/merchant/firstadd/signatureimage',  upload.single('signatureimage'), async(req,res) =>{
    try {

        const filename = `${req.body.store_name}-signature_image.png`        
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
// sudah bisa
router.get('/merchant/ktp/:filename', (req, res) => {
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
// sudah bisa
router.get('/merchant/store/:filename', (req, res) => {
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
// sudah bisa
router.get('/merchant/signature/:filename', (req, res) => {
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

/////////////////////
// EDIT KTP IMAGE //
///////////////////
router.post('/merchant/ktpimage/:id',  upload.single('ktp'), async(req,res) =>{
    try {
        const ktpimg = `${req.params.id}-ktp.png`
    
        const sql = `UPDATE table_merchant SET ktp_image = ? WHERE id = ?`
        const data = [ktpimg. req.params.id]
    
        await sharp(req.file.buffer).rresize(200).png().toFile(`${ktpImageDirectory}/${ktpimg}`)
    
        conn.query(sql, data, (err,result) =>{
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send({message: "berhasil", result})
        })
    } catch (err) {
        res.status(404).send(err)
    }
},(err, req, res, next) => {
    res.status(500).send(err)
})

///////////////////////
// EDIT STORE IMAGE //
/////////////////////
router.post('/merchant/storeimage/:id',  upload.single('ktp'), async(req,res) =>{
    try {
        const storeimg = `${req.params.id}-store.png`
    
        const sql = `UPDATE table_merchant SET store_image = ? WHERE id = ?`
        const data = [storeimg. req.params.id]
    
        await sharp(req.file.buffer).rresize(200).png().toFile(`${storeImageDirectory}/${storeimg}`)
    
        conn.query(sql, data, (err,result) =>{
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send({message: "berhasil", result})
        })
    } catch (err) {
        res.status(404).send(err)
    }
},(err, req, res, next) => {
    res.status(500).send(err)
})

//////////////////////////
// EDIT SIGNATURE IMAGE //
/////////////////////////
router.post('/merchant/signatureimage/:id',  upload.single('ktp'), async(req,res) =>{
    try {
        const signatureimg = `${req.params.id}-signature.png`
    
        const sql = `UPDATE table_merchant SET signature_image = ? WHERE id = ?`
        const data = [storeimg. req.params.id]
    
        await sharp(req.file.buffer).rresize(200).png().toFile(`${signatureImageDirectory}/${signature}`)
    
        conn.query(sql, data, (err,result) =>{
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send({message: "berhasil", result})
        })
    } catch (err) {
        res.status(404).send(err)
    }
},(err, req, res, next) => {
    res.status(500).send(err)
})


//------------------ LEADER ------------------\\ 
///////////////////////////////
// READ ALL MERCHANT LEADER //
/////////////////////////////
// belum ada jwt
// bisa
router.get('/merchant/leader/read',  (req,res) =>{
    const sql = `SELECT * FROM table_merchant`

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
// belum ada jwt
// bisa
router.get('/merchant/leader/read/notapproval',  (req,res) =>{
    const sql = `SELECT merch.id, merch.staff_id, staff.staff_id, staff.name,
    merch.date_created, merch.store_name, merch.category_id, merch.address,
    merch.mobile_number, merch.location, merch.approval, merch.KTP_image, merch.store_image, merch.signature_image
    FROM table_merchant as merch
    JOIN table_staff as staff 
    ON merch.staff_id = staff.id WHERE approval = 0;`

    conn.query(sql, (err, result) =>{
        if(err){
            return res.status(500).send(err)
        }
        res.status(200).send(result)
    })
})

///////////////////////////
// EDIT MERCHANT LEADER //
/////////////////////////
// belum ada jwt
// bisa
router.patch('/merchant/leader/update/:id',  (req,res)=>{
    const sql = `UPDATE table_merchant SET ? WHERE id = ?`
    const data = [req.body, req.params.id]

    conn.query(sql,data, (err, result) =>{
        if(err){
            return res.status(500).send(err.sqlMessage)
        }

        res.status(200).send({message: "Merchant berhasil di edit", result})
    })
})


/////////////////////////////
// DELETE MERCHANT LEADER //
///////////////////////////
// butuh 
// belum bisa
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
// butuh  jwt
// bisa
router.post('/leader/insert/staffid',  (req,res) =>{
    const sql = `INSERT INTO table_staff (staff_id) SET ?`
    const data = req.body 


    conn.query(sql, data, (err,result) =>{
        if (err) {
            return res.send(err)
        }
        res.send({message: 'Register Berhasil', result})
    })
})

//------------------ SALES ------------------\\ 

///////////////////////////
// READ ID FROM STAFF_ID//
/////////////////////////
router.get('/sales/read/id/:staff_id', (req,res) =>{
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
// sudah bisa
// butuh 
router.get('/merchant/sales/read/:staff_id', (req,res) =>{

    const getStaffId = `SELECT id FROM table_staff WHERE staff_id = ${req.params.staff_id}`
    
    conn.query(getStaffId, (err, result) =>{
        if(err){
            return res.status(500).send(err)
        }
        
        let id = result[0].id
        
        const sql = `SELECT * FROM table_merchant WHERE staff_id = ${id}`
        conn.query(sql, (err,result) =>{
            if(err){
                return res.status(500).send(err)
            }
            console.log(result[0]);
            res.status(200).send(result)

        })
    })
})

/////////////////////////////////////////
// INSERT DATA TEXT MERCHANT BY SALES //
///////////////////////////////////////
// butuh 
router.post('/merchant/sales/insert', (req,res) =>{

        const sql = `INSERT INTO table_merchant SET 
        staff_id = ?, date_created = ?,
        store_name = ?, category_id = ?,
        address = ?, mobile_number = ?,
        location = ?, approval = ? `
    
        // staff_id: req.user.id, / staff_id: req.user.staff_id,
    
        const dataFinal = [ req.body.staff_id, req.body.date_created, req.body.store_name,
            req.body.category_id, req.body.address, req.body.mobile_number, req.body.location, req.body.approval]

        conn.query(sql, dataFinal, (err,result) =>{
            if(err) return res.status(500).send(err)

            res.status(200).send({message: "Penambahan Product Berhasil", result})
        })
})

////////////////////////
// READ ALL CATEGORY //
//////////////////////
// Sudah Bisa
router.get('/read/allcategory', (req,res) =>{
    const sql = `SELECT * FROM table_category`

    conn.query(sql, (err,result) =>{
        if(err) return res.send(500).send(err)

        console.log(result[0])
        res.status(200).send(result)
    })
})


/////////////////////
// REGISTER STAFF //
///////////////////
// bisa virza
router.post('/register_staff', (req, res) => {
    const sql = `Select * from table_staff where staff_id = ${req.body.staff_id} and status = 1 `
    
    conn.query(sql, (err, result) => {
      if(err) return res.status(500).send(err)
      
      if(result  < 1) return res.status(200).send({message:"staff_id tidak di temukan"})
       
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
// bisa virza
router.post('/login', (req, res) => {
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
// butuh 
router.delete('/logout', (req,res) => {
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
// sudah bisa
router.get('/detailmerchant/:id', (req,res) =>{
    const sql = `SELECT * FROM table_merchant WHERE id = ${req.params.id}`

    conn.query(sql, (err,result) =>{
        if(err) return res.send(500).send(err)

        console.log(result[0])
        res.status(200).send(result)
    })
})

/////////////////////////////
// UPDATE DETAIL MERCHANT //
///////////////////////////
router.patch('/update/detailmerchant/:id', (req,res) =>{
    const sql = `UPDATE table_merchant SET ?  WHERE id = ${req.params.id}`


    conn.query(sql, (err,result) =>{
        if(err) return res.send(500).send(err)

        console.log(result[0])
        res.status(200).send(result)
    })
})
module.exports = router