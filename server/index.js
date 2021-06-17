const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');

const app = express();

const pool = require("./db");
const port = 5000;

//middleware
app.use(fileUpload());
app.use(express.urlencoded({
  extended: false,
  limit: '2mb'
}))
app.use(cors())
app.use(express.json())

//Add new user
app.post("/add-user", async (req, res) => {
  try {
    const { full_name, email, password, date_birth, passphrase, doctor_type, doctor_name } = req.body;
    const user = await (await pool).query('insert into users(full_name, email, password, date_birth, passphrase, doctor_name, doctor_type) values(?,?,?,?,?,?,?) returning *', [full_name, email, password, date_birth, passphrase, doctor_name, doctor_type]);
    //        console.log({full_name, email, password, date_birth, passphrase, doctor_type, doctor_name})


    res.status(200).json("OK");
  } catch (err) {
    console.error(err);
  }
})

//Get user
app.get("/get-user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await (await pool).query('select * from users where email=?', [email]);

    console.log("runned")
    if (user[0]) res.status(200).json(user[0])
    else res.status(200).json(null)
  } catch (err) {
    console.error(err);
  }
})

app.get("/get-doctor-type-list", async (req, res) => {
  try {
    const doctorTypeList = await (await pool).query("select distinct(type) from doctors")

    res.status(200).json(doctorTypeList);
  } catch (err) {
    console.error(err);
  }
})

app.get("/get-doctor-name-list/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const doctorsNameList = await (await pool).query("select name from doctors where type=?", [name])

    res.status(200).json(doctorsNameList)
  } catch (err) {
    console.error(err);
  }
})

app.post("/add-medicine", async (req, res) => {
  const { name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, major_type, minor_type, date_added } = req.body;
  const { images } = req.files;

  const imagesLen = images.length;
  console.log({ name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, imagesLen, })

  const medicine = await (await pool).query("insert into medicine(name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, major_type, minor_type, date_added) values(?,?,?,?,?,?,?,?,?,?,?,?) returning *", [
    name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, major_type, minor_type, date_added
  ]);
  const med_id = medicine[0].med_id;

  if (images.length === undefined) await (await pool).query("insert into pics(med_id, pic) values(?,?)", [med_id, images.data])
  else {
    for (let i = 0; i < images.length; i++) await (await pool).query("insert into pics(med_id, pic) values(?,?)", [med_id, images[i].data])
  }


  res.status(200).json("OK")
})

app.get("/get-all-major-medicine-category", async (req, res) => {
  try {
    const category = await (await pool).query("select distinct(major_cate) from medicinecategory");
    // console.log(category)
    res.status(200).json(category)
  } catch (error) {
    console.error(error);
  }
})

app.get("/get-all-minor-medicine-category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const subCat = await (await pool).query("select distinct(minor_cate) from medicinecategory where major_cate=?", [category])

    // console.log(category)
    res.status(200).json(subCat)
  } catch (error) {
    console.error(error)
  }
})

app.get("/get-all-major-medicine", async (req, res) => {
  try {
    const category = await (await pool).query("select distinct(major) from medicine");

    res.status(200).json(category)
  } catch (error) {
    console.error(error);
  }
})

app.get("/get-all-med-data/:pageNo/:searchTerm/:major", async (req, res) => {
  try {
    const { pageNo } = req.params;
    const startingDataLimit = pageNo * 6;

    let { searchTerm, major } = req.params

    if (searchTerm === 'none') searchTerm = '';
    let medData = null;

    if (major !== 'all')
      medData = await (await pool).query("select * from medicine where major = ? and (name like ? or mfr like ? or country_of_origin like ?) order by date_added desc limit ?, 6", [major, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, startingDataLimit])
    else
      medData = await (await pool).query("select * from medicine where name like ? or mfr like ? or country_of_origin like ? order by date_added desc limit ?, 6", [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, startingDataLimit])

    const medImages = []
    for (let i = 0; i < medData.length; i++) {
      const images = await (await pool).query("select * from pics where med_id = ? limit 1", medData[i].med_id);
      medImages.push(images);
    }

    res.status(200).json({
      medData,
      medImages
    });
  } catch (error) {
    console.error(error);
  }
})

app.get("/update-get-all-med-data/:pageNo/:searchTerm/:major", async (req, res) => {
  try {
    const { pageNo } = req.params;
    const startingDataLimit = pageNo * 10;

    let { searchTerm, major } = req.params

    if (searchTerm === 'none') searchTerm = '';
    let medData = null;

    if (major !== 'all')
      medData = await (await pool).query("select * from medicine where major = ? and (name like ? or mfr like ? or country_of_origin like ?) order by date_added desc limit ?, 10", [major, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, startingDataLimit])
    else
      medData = await (await pool).query("select * from medicine where name like ? or mfr like ? or country_of_origin like ? order by date_added desc limit ?, 10", [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, startingDataLimit])

    console.log({ major, searchTerm })
    res.status(200).json(medData);
  } catch (error) {
    console.error(error);
  }
})

app.post("/delete-medicine-entry", async (req, res) => {
  try {
    const { med_id } = req.body;
    await(await pool).query("delete from medicine where med_id=?",[med_id])
    res.status(200).json("DONE");
  } catch (err) {
    console.error(err)
  }

})

app.get("/get-all-med-pics/:med_id", async (req, res) => {
  try {
    const { med_id } = req.params;
    const pics = await (await pool).query("select * from pics where med_id=?", [med_id])

    res.status(200).json(pics);
  } catch (err) {
    console.log(err)
  }
})

app.post("/update-medicine-without-pics", async (req, res) => {
  const { name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, major_type, minor_type, date_added, med_id } = req.body;

  console.log({ name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, major_type, minor_type, date_added, med_id })

  const medicine = await (await pool).query("update medicine set name=?, quantity=?, major=?, price=?, describes=?, mfr=?, country_of_origin=?, benefit=?, direction=?, major_type=?, minor_type=?, date_added=? where med_id=?", [
    name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, major_type, minor_type, date_added, med_id
  ]);

  res.status(200).json("OK")
})

app.post("/update-medicine-with-pics", async (req, res) => {
  const { name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, major_type, minor_type, date_added, med_id } = req.body;
  const { images } = req.files;
  console.log(images.length === undefined)

  const imagesLen = images.length;
  // console.log({ name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, imagesLen, })

  const medicine = await (await pool).query("update medicine set name=?, quantity=?, major=?, price=?, describes=?, mfr=?, country_of_origin=?, benefit=?, direction=?, major_type=?, minor_type=?, date_added=? where med_id=?", [
    name, quantity, major, price, describes, mfr, country_of_origin, benefit, direction, major_type, minor_type, date_added, med_id
  ]);

  await (await pool).query("delete from pics where med_id=?", [med_id])

  if (images.length === undefined) await (await pool).query("insert into pics(med_id, pic) values(?,?)", [med_id, images.data])
  else for (let i = 0; i < images.length; i++) await (await pool).query("insert into pics(med_id, pic) values(?,?)", [med_id, images[i].data])

  res.status(200).json("OK")
})

app.get("/get-all-users", async (req, res) => {
  try {
    const user = await (await pool).query('select user_id,full_name,doctor_type,doctor_name,roles from users');

    if (user) res.status(200).json(user)
    else res.status(200).json(null)
  } catch (err) {
    console.error(err);
  }
})
app.get("/get-all-doctors", async (req, res) => {
  try {
    const user = await (await pool).query('select * from doctors');

    if (user) res.status(200).json(user)
    else res.status(200).json(null)
  } catch (err) {
    console.error(err);
  }
})

app.use('/delete-user/:user_d', async (req, res) => {
  const user_id = req.params;
  try {
    console.log(user_id)
    const deleted = await (await pool).query("delete from users where user_id=?", user_id)
  } catch (err) {
    console.log(err);
  }
})

app.post('/update-user-password', async (req, res) => {
  try {
    const { password, user_id } = req.body;
    const data = await (await pool).query('update users set password=? where user_id=?', [password, user_id]);

    console.log(password, user_id)
    res.status(200).json('DONE');
  } catch (err) {
    console.log(err)
  }
})

app.post('/update-user-passphrase', async (req, res) => {
  try {
    const { passphrase, user_id } = req.body;
    const data = await (await pool).query('update users set passphrase=? where user_id=?', [passphrase, user_id]);

    res.status(200).json('DONE');
  } catch (err) {
    console.log(err)
  }
})

app.post('/change-user-role', async (req, res) => {
  try {
    const { roles, user_id } = req.body;
    const data = await (await pool).query('update users set roles = ? where user_id = ?', [roles, user_id])

    console.log(req.body)
    res.status(200).json('DONE');
  } catch (err) {
    console.log(err)
  }
})

app.post("/update-user-info", async (req, res) => {
  try {
    const { full_name, email, doctor_type, doctor_name, date_birth, user_id } = req.body;
    const updated = await (await pool).query('update users set full_name=?, email=?, doctor_type=?, doctor_name=?, date_birth=? where user_id=?', [full_name, email, doctor_type, doctor_name, date_birth, user_id]);

    res.status(200).json("DONE");
  } catch (err) {
    console.log(err)
  }
})

app.listen(port, () => {
  console.log(`server started on port ${port}`)
})
