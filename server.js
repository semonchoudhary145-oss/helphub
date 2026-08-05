var express = require("express");

var app = express();



app.use(express.static("public"));//index.html will open
app.use(express.urlencoded(true));

app.listen(2006, function () {
    console.log("Server Started");
})

app.get("/", function (req, resp) {
    var path = __dirname + "/public/index.html";
    resp.sendFile(path);
});
app.get("/chk-donor", function (req, resp) {
    var path = __dirname + "/public/Donor-profile.html";
    resp.sendFile(path);
})
app.get("/chk-donorprofile", function (req, resp) {
    var path = __dirname + "/public/Dash-donor.html";
    resp.sendFile(path);
})
app.get("/chk-avail", function (req, resp) {
    var path = __dirname + "/public/Avail-med.html";
    resp.sendFile(path);
})
app.get("/chk-availmed", function (req, resp) {
    var path = __dirname + "/public/Dash-donor.html";
    resp.sendFile(path);
})
app.get("/chk-med-equipment", function (req, resp) {
    var path = __dirname + "/public/AvailEquip.html";
    resp.sendFile(path);
})
app.get("/chk-availequip", function (req, resp) {
    var path = __dirname + "/public/Dash-donor.html";
    resp.sendFile(path);
})
app.get("/chk-admindash", function (req, resp) {
    var path = __dirname + "/public/Dash-admin.html";
    resp.sendFile(path);
})
app.get("/chk-users", function (req, resp) {
    var path = __dirname + "/public/Admin-users-dash.html";
    resp.sendFile(path);
})
app.get("/chk-donormanager", function (req, resp) {
    var path = __dirname + "/public/Admin-donors-dash.html";
    resp.sendFile(path);
})
app.get("/chk-allmedicine", function (req, resp) {
    var path = __dirname + "/public/allmedicine.html";
    resp.sendFile(path);
})
app.get("/chk-medfinder", function (req, resp) {
    var path = __dirname + "/public/medFinder.html";
    resp.sendFile(path);
})
app.get("/chk-medfinder", function (req, resp) {
    var path = __dirname + "/public/Dash-NGO.html";
    resp.sendFile(path);
})
app.get("/chk-ngoregister", function (req, resp) {
    var path = __dirname + "/public/Ngo-Registration.html";
    resp.sendFile(path);
})
app.get("/chk-ngodash", function (req, resp) {
    var path = __dirname + "/public/Dash-NGO.html";
    resp.sendFile(path);
})
app.get("/chk-ngofinder", function (req, resp) {
    var path = __dirname + "/public/Ngo-finder.html";
    resp.sendFile(path);
})
app.get("/chk-equipfinder", function (req, resp) {
    var path = __dirname + "/public/equipFinder.html";
    resp.sendFile(path);
})
app.get("/chk-equipfinder", function (req, resp) {
    var path = __dirname + "/public/Dash-NGO.html";
    resp.sendFile(path);
})
app.get("/chk-needyprofile", function (req, resp) {
    var path = __dirname + "/public/AI.html";
    resp.sendFile(path);
})
app.get("/chk-ngodash", function (req, resp) {
    var path = __dirname + "/public/Dash-NGO.html";
    resp.sendFile(path);
})
app.get("/chk-ngoprofile", function (req, resp) {
    var path = __dirname + "/public/Dash-NGO.html";
    resp.sendFile(path);
})
app.get("/chk-needydash", function (req, resp) {
    var path = __dirname + "/public/Dash-needy.html";
    resp.sendFile(path);
})
app.get("/chk-needyprofile", function (req, resp) {
    var path = __dirname + "/public/AI.html";
    resp.sendFile(path);
})
app.get("/chk-ngofinder", function (req, resp) {
    var path = __dirname + "/public/Ngo-finder.html";
    resp.sendFile(path);
})
app.get("/chk-medfinder", function (req, resp) {
    var path = __dirname + "/public/medFinder.html";
    resp.sendFile(path);
})
app.get("/chk-equipfinder", function (req, resp) {
    var path = __dirname + "/public/equipFinder.html";
    resp.sendFile(path);
})






//--------------------my sql connection-------------------------------//
var fileuploader = require("express-fileupload");
app.use(fileuploader());
var cloudinary = require("cloudinary").v2;
var mysql = require("mysql2");
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_KEY
});
let url = process.env.AIVEN_URL;
let mysqlCon = mysql.createConnection(url);
mysqlCon.connect(function (err) {
    if (err == null)
        console.log("Connected Successfulllyyyyy");
    else
        console.log(err.message);
})

//---------------------my sql dprofiles-----fileupload-----------------//

app.post("/chk-pic", async function (req, resp) {
    //fileuploading
    let msg = "file not uploaded";
    let aadharUrl = "nopic.jpg";
    let profileUrl = "nopic.jpg";
    if (req.files != null) {
        let aadharfile = req.files.Aadharpic.name;
        let aadharpath = __dirname + "/upload/" + aadharfile;

        await req.files.Aadharpic.mv(aadharpath);

        msg = "Upload sucessfully";

        await cloudinary.uploader.upload(aadharpath).then(function (picUrResult) {
            aadharUrl = picUrResult.url;
            console.log("***")
            console.log(aadharUrl);
        })
    }
    if (req.files != null) {
        let profilefile = req.files.Profilepic.name;
        let profilepath = __dirname + "/upload/" + profilefile;

        await req.files.Profilepic.mv(profilepath);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(profilepath).then(function (picUrResult) {
            profileUrl = picUrResult.url;
            console.log("***")
            console.log(profileUrl);
        })
    }


    let email = req.body.txtEmail;
    let name = req.body.txtName;
    let mobile = req.body.txtMobile;
    let address = req.body.txtAddress;
    let city = req.body.txtCity;

    let acardpath = aadharUrl;

    let picpath = profileUrl;

    mysqlCon.query("insert into dprofiles(emailid,name,mobile,address,city,acardpath,picpath) values(?,?,?,?,?,?,?)", [email, name, mobile, address, city, acardpath, picpath], function (err) {
        if (err == null) {
            resp.sendFile(__dirname + "/public/Response.html");
        }
        else
            resp.send(err.message);
    })
})

//-----------------------------my sql medicines-----------------------------------//
app.post("/avail-medicine", async function (req, resp) {
    console.log("medicine called");
    //fileuploading
    let msg = "file not uploaded";
    let medUrl = "nopic.jpg";
    if (req.files != null) {
        let medfile = req.files.medpic.name;
        let medpath = __dirname + "/upload/" + medfile;

        await req.files.medpic.mv(medpath);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(medpath).then(function (picUrResult) {
            medUrl = picUrResult.url;
            console.log("***")
            console.log(medUrl);
        })
    }
    let email1 = req.body.txtEmail;
    let medname = req.body.txtMedname;
    let expiry = req.body.txtExpiry;
    let company = req.body.txtCompany;
    let packing = req.body.txtPacking;
    let qty = req.body.txtQty;
    let info = req.body.txtInfo;

    let picurl = medUrl;

    mysqlCon.query("insert into medicines(email,medname,expdate,company,packing,qty,info,picurl) values(?,?,?,?,?,?,?,?)", [email1, medname, expiry, company, packing, qty, info, picurl], function (err) {
        if (err == null)
            resp.send("Badhaaaaaaiiiiii");
        else
            resp.send(err.message);
    })
})

//--------------------------my sql eequipmenttt-----------------------------//

app.post("/chk-equipment", async function (req, resp) {
    //fileuploading
    let msg = "file not uploaded";
    let equ1Url = "nopic.jpg";
    let equ2Url = "nopic.jpg";
    if (req.files != null) {
        let equ1file = req.files.picUrl.name;
        let equ1path = __dirname + "/upload/" + equ1file;

        await req.files.picUrl.mv(equ1path);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(equ1path).then(function (picUrResult) {
            equ1Url = picUrResult.url;
            console.log("***")
            console.log(equ1Url);
        })
    }
    if (req.files != null) {
        let equ2file = req.files.picUrl2.name;
        let equ2path = __dirname + "/upload/" + equ2file;

        await req.files.picUrl2.mv(equ2path);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(equ2path).then(function (picUrResult) {
            equ2Url = picUrResult.url;
            console.log("***")
            console.log(equ2Url);
        })
    }




    let email = req.body.txtEmail;
    let equipment = req.body.txtEquipment;
    let condition = req.body.txtCondition;
    let type = req.body.type;


    let amount;
    if (type == "borrow") {
        amount = 0;
    }
    else {
        amount = req.body.txtAmount;
    }


    let picurl = equ1Url;

    let pic2url = equ2Url;
    let info = req.body.txtInfo;

    mysqlCon.query("insert into eequipmenttt(emailid,equipment,conditionn,type,amount,picurl,pic2url,info) values(?,?,?,?,?,?,?,?)", [email, equipment, condition, type, amount, picurl, pic2url, info], function (err) {
        if (err == null)
            resp.send("badhaaaaaaiiiiii");
        else
            resp.send(err.message);
    })
})



//------------------------modify/update button-------------------------//

app.post("/modify-profile", async function (req, resp) {
    //fileuploading
    let msg = "file not uploaded";
    let aadharUrl = "nopic.jpg";
    let profileUrl = "nopic.jpg";
    if (req.files != null) {
        let aadharfile = req.files.Aadharpic.name;
        let aadharpath = __dirname + "/upload/" + aadharfile;

        await req.files.Aadharpic.mv(aadharpath);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(aadharpath).then(function (picUrResult) {
            aadharUrl = picUrResult.url;
            console.log("***")
            console.log(aadharUrl);
        })
    }
    else {
        aadharUrl = req.body.hdn;
    }
    if (req.files != null) {
        let profilefile = req.files.Profilepic.name;
        let profilepath = __dirname + "/upload/" + profilefile;

        await req.files.Profilepic.mv(profilepath);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(profilepath).then(function (picUrResult) {
            profileUrl = picUrResult.url;
            console.log("***")
            console.log(profileUrl);
        })
    }
    else {
        profileUrl = req.body.hdn2;
    }

    let email = req.body.txtEmail;
    let name = req.body.txtName;
    let mobile = req.body.txtMobile;
    let address = req.body.txtAddress;
    let city = req.body.txtCity;

    let acardpath = aadharUrl;

    let picpath = profileUrl;

    mysqlCon.query("update  dprofiles set name=?,mobile=?,address=?,city=?,acardpath=?,picpath=? where emailid=?", [name, mobile, address, city, acardpath, picpath, email], function (err) {
        if (err == null)
            resp.send("Badhaaaaaaiiiiii");
        else
            resp.send(err.message);
    })

})


//-----------------------get profile button-------------------------------//
app.get("/get-profile", function (req, resp) {

    let email = req.query.emailKuch;

    mysqlCon.query("select * from dprofiles where emailid=?", [email], function (err, resultJSONAry) {
        if (err == null) {
            resp.send(resultJSONAry)

        }
        else
            resp.send(err.message);
    })
})



//---------------email avaialble or occupied------------------//

app.get("/check-email", function (req, resp) {

    let email = req.query.emailKuch;
    mysqlCon.query("select * from users26 where emailid=?", [email], function (err, resultJSNAry) {
        if (err == null) {
            if (resultJSNAry.length == 1)
                resp.send("Already Occupied");
            else
                resp.send("Available");
        }
        else
            resp.send(err.message);

    })
})

//------------------------signup ajax-------------------------//
app.get("/signup-ajax", function (req, resp) {
    let email = req.query.emailKuch;
    let pwd = req.query.pwdKuch;
    let utype = req.query.utypeKuch;
    // let active=1;
    mysqlCon.query("insert into users26 values(?,?,?,current_date(),1)", [email, pwd, utype], function (err) {
        if (err == null)
            resp.send("Signup Successfullyyy");
        else
            resp.send(err.message);
    })

});


//---------------------login ajax---------------------------//
app.get("/login-ajax", function (req, resp) {
    let email = req.query.emailKuchlogin;
    let pwd = req.query.pwdKuchlogin;
    //resultJSNAry → contains the rows returned from the database.

    mysqlCon.query("select * from users26 where emailid=? and Pwd=?", [email, pwd], function (err, resultJSNAry) {
        if (err == null) {
            if (resultJSNAry.length == 1) {
                if (resultJSNAry[0].activee == 1)
                    resp.send(resultJSNAry[0].Utype);
                else
                    resp.send("Invalid User Id or Password");
            }
            else
                resp.send("Invalid Email Id or Password");
        }
        else
            resp.send(err.message);
    })
})

//---------------signup block,unblock/resume,showall (admin users)----------------//
app.get("/angular1", function (req, resp) {
    var path = __dirname + "/public/Admin-users-dash.html";
    resp.sendFile(path);
})
app.get("/show-all", function (req, resp) {
    //console.log("show-all route called");
    mysqlCon.query("select * from users26 ", function (err, resultJSONAry) {
        if (err == null) {
            console.log(resultJSONAry)
            resp.send(resultJSONAry)

        }
        else
            // console.log(resultJSONAry)
            resp.send(err.message);
    })
})
//----------------active=0--------block---------------//
app.get("/block-users", function (req, resp) {

    let emailid = req.query.emailkeykuch;

    mysqlCon.query("update users26 set activee=0 where emailid=?", [emailid], function (err, result) {

        if (err == null) {

            resp.send("User Blocked Successfully");
        }
        else {

            resp.send(err.message);
        }

    }
    );

});
//------------active=1-------resume---------------------//
app.get("/unblock-users", function (req, resp) {

    let emailid = req.query.emailkeykuch;

    mysqlCon.query("update users26 set activee=1 where emailid=?", [emailid], function (err, result) {

        if (err == null) {

            resp.send("User Resumed Successfully");
        }
        else {

            resp.send(err.message);
        }

    }
    );

});

//-----------donors fetch all(admin-donors)-------------//
app.get("/angular2", function (req, resp) {
    var path = __dirname + "/public/Admin-donor-dash.html";
    resp.sendFile(path);
})
app.get("/fetch-all", function (req, resp) {
    //console.log("show-all route called");
    mysqlCon.query("select * from dprofiles ", function (err, resultJSONAry) {
        if (err == null) {
            console.log(resultJSONAry)
            resp.send(resultJSONAry)

        }
        else
            // console.log(resultJSONAry)
            resp.send(err.message);
    })
})
//----------------fetch one email----medicine manager------------//
app.get("/fetch-users", function (req, resp) {

    let emailid = req.query.emailkeykuch;
    console.log("email ayaa", emailid);

    mysqlCon.query("select*from medicines  where email=?", [emailid], function (err, result) {

        if (err == null) {

            resp.send(result);
        }
        else {

            resp.send(err.message);
        }

    });


});
//----------------------udpdate pwd------------------//
app.get("/updatepwd-users", function (req, resp) {

    let emailid = req.query.emailkeykuch;
    let password = req.query.passwordkeykuch;
    console.log("email ayaa", emailid);
    console.log("email ayaa", password);
    mysqlCon.query("update users26 set Pwd=?  where emailid=? and Pwd=?", [password, emailid, password], function (err, result) {

        if (err == null) {

            resp.send("update password");
        }
        else {

            resp.send(err.message);
        }

    });


});
//----------------fetch one email----equip manager------------//
app.get("/fetchequip-users", function (req, resp) {

    let emailid = req.query.emailkeykuch;
    console.log("email ayaa", emailid);

    mysqlCon.query("select*from eequipmenttt  where emailid=?", [emailid], function (err, result) {

        if (err == null) {

            resp.send(result);
        }
        else {

            resp.send(err.message);
        }

    });


});
//------------------fetch all medicine in all medicines----------------------------------------//
app.get("/fetch-allmed", function (req, resp) {

    mysqlCon.query("select * from medicines ", function (err, resultJSONAry) {
        if (err == null) {
            console.log(resultJSONAry)
            resp.send(resultJSONAry)

        }
        else
            resp.send(err.message);
    })
})
//------------------particular fetch one medicine-----------------------------------------//
app.get("/fetch-one-med", function (req, resp) {
    let emailid = req.query.emailkeykuch;

    mysqlCon.query("select * from medicines where email=? ", [emailid], function (err, resultJSONAry) {
        if (err == null) {
            console.log(resultJSONAry)
            resp.send(resultJSONAry)

        }
        else
            resp.send(err.message);
    })
})
//combo box---------
//--------------autocompletecombobox of medicines---------------------//
app.get("/fetch-distinct-medicines", function (req, resp) {
    mysqlCon.query("select distinct medname from medicines", function (err, resultJSONAry) {
        if (err == null) {
            // console.log(resultJSONAry)
            resp.send(resultJSONAry)

        }
        else
            resp.send(err.message);
    })
})
//--autocompletecombobox of city-------city fetch from dprofiles------------//
app.get("/fetch-distinct-city", function (req, resp) {
    mysqlCon.query("select distinct city from dprofiles", function (err, resultJSONAry) {
        if (err == null) {

            // console.log(resultJSONAry)
            resp.send(resultJSONAry)

        }
        else
            resp.send(err.message);
    })
})
//----------------inner join city or medicine basis on email----------//
app.get("/find-donorcitymed", function (req, resp) {

    let city = req.query.city;
    let medicine = req.query.medicine;
    let query = `
    select*
    from dprofiles
    inner join medicines
    on dprofiles.emailid=medicines.email
    where dprofiles.city=? and medicines.medname=?;`
    mysqlCon.query(query, [city, medicine], function (err, resultJSONAry) {
        if (err == null) {

            // console.log(resultJSONAry)
            resp.send(resultJSONAry)

        }
        else
            resp.send(err.message);
    })
})
//---------------fetch donor from card in med finder-------------//
app.get("/fetch-donors", function (req, resp) {

    let email = req.query.email;

    mysqlCon.query("select * from dprofiles where emailid=?", [email], function (err, resultJSONAry) {

        if (err == null)
            resp.send(resultJSONAry);

        else

            resp.send(err);

    });

});
//-----------------------------my sql ngos-----------------------------------//

app.post("/ngo-registration", async function (req, resp) {
    console.log(req.files);
    console.log(req.files.ngopic);
    console.log(req.files.medpic);

    //fileuploading
    let msg = "file not uploaded";
    let ngoUrl = "nopic.jpg";
    if (req.files != null) {

        let ngofile = req.files.ngopic.name;
        let ngopath = __dirname + "/upload/" + ngofile;


        await req.files.ngopic.mv(ngopath);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(ngopath).then(function (picUrResult) {
            ngoUrl = picUrResult.url;
            console.log("***")
            console.log(ngoUrl);
        })
    }

    let email = req.body.txtEmail;
    let ngoname = req.body.txtNgoname;
    let regoff = req.body.txtRegoff;
    let city = req.body.txtCity;
    let website = req.body.txtWebsite;
    let contactno = req.body.txtContact;
    let since = req.body.txtSince;
    let chairpers = req.body.txtChairper;
    let ngoprofile = req.body.txtNgoprof;
    let regno = req.body.txtRegnum;

    let picurl = ngoUrl;

    mysqlCon.query("insert into ngos(emailid,ngo,regoffice,city,website,contactno,since,chairperson,ngoworks,regnumber,picurl) values(?,?,?,?,?,?,?,?,?,?,?)",
        [email, ngoname, regoff, city, website, contactno, since, chairpers, ngoprofile, regno, picurl], function (err) {
            if (err == null)
                resp.send("Badhaaaaaaiiiiii");
            else
                resp.send(err.message);
        })
})
//---------fetch city from ngos table-----------//
app.get("/fetch-ngo-city", function (req, resp) {
    mysqlCon.query("select distinct city from ngos", function (err, resultJSONAry) {
        if (err == null) {

            // console.log(resultJSONAry)
            resp.send(resultJSONAry);

        }
        else
            resp.send(err.message);
    })
})
//--------------fetch ngo in ngo-finder------------------//
app.get("/find-ngo", function (req, resp) {
    let city = req.query.txtCity;

    mysqlCon.query("select * from ngos where city=?", [city], function (err, resultJSONAry) {
        if (err == null) {

            // console.log(resultJSONAry)
            resp.send(resultJSONAry)

        }
        else
            resp.send(err.message);
    })
})
//--------------fetch city from dprofles in equipfinder------------------//
app.get("/fetch-equip-city", function (req, resp) {


    mysqlCon.query("select distinct city from dprofiles inner join eequipmenttt on dprofiles.emailid=eequipmenttt.emailid order by dprofiles.city", function (err, resultJSONAry) {
        if (err == null) {

            // console.log(resultJSONAry)
            resp.send(resultJSONAry);

        }
        else
            resp.send(err.message);
    })
})
//--------------fetch equipment in equipfinder------------------//
app.get("/fetch-equipment", function (req, resp) {


    mysqlCon.query("select distinct equipment from eequipmenttt", function (err, resultJSONAry) {
        if (err == null) {

            // console.log(resultJSONAry)
            resp.send(resultJSONAry);

        }
        else
            resp.send(err.message);
    })
})

//----------------button radio get data----------------//
app.get("/search-equipment", function (req, resp) {
    let city = req.query.city;
    let equipment = req.query.equipment;
    let type = req.query.type;
    console.log("server ko mila", city, equipment, type);

    mysqlCon.query(`select dprofiles.emailid, dprofiles.name, dprofiles.mobile, dprofiles.city,
                eequipmenttt.equipment, eequipmenttt.conditionn, eequipmenttt.type,
                eequipmenttt.amount, eequipmenttt.picurl,eequipmenttt.pic2url
                from dprofiles
                inner join eequipmenttt on dprofiles.emailid=eequipmenttt.emailid
                where dprofiles.city=? and eequipmenttt.equipment=? and eequipmenttt.type=?`,
        [city, equipment, type],
        function (err, result) {
            if (err) {
                console.log("SQL ERROR:", err);
                resp.send([]);
            }
            else {
                console.log("RESULT:", result.length);
                resp.send(result);
            }
        })
})
//---------------------GEN AI-----------------------//
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AQ.Ab8RN6K2FB_7CLyLfLDCjb-7JfRNdAp39fKifeUw-BTu9DXPMA");
const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

async function geminicontact(imgurl) {
    const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: '',address:''}. Dont give output as string."
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())

    const cleaned = result.response.text().replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);
    console.log(jsonData);

    return jsonData

}
app.post("/chk-needyprofile", async function (req, resp) {

    let frontdata;
    let backdata;
    let msg = "file not uploaded";
    let pic1Url = "nopic.jpg";
    let pic2Url = "nopic.jpg";
    if (req.files != null) {
        let pic1file = req.files.picUrl.name;
        let pic1path = __dirname + "/upload/" + pic1file;

        await req.files.picUrl.mv(pic1path);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(pic1path).then(async function (picUrResult) {
            pic1Url = picUrResult.url;
            console.log("***")
            console.log(pic1Url);
            frontdata = await geminicontact(pic1Url);
            console.log(frontdata);
        })
    }
    if (req.files != null) {
        let pic2file = req.files.picUrl2.name;
        let pic2path = __dirname + "/upload/" + pic2file;

        await req.files.picUrl2.mv(pic2path);

        msg = "upload sucessfully";

        await cloudinary.uploader.upload(pic2path).then(async function (picUrResult) {
            pic2Url = picUrResult.url;
            console.log("***")
            console.log(pic2Url);
            backdata = await geminicontact(pic2Url);
            console.log(backdata);
        })
    }


    let email = req.body.txtEmail;
    let mobile = req.body.txtMobile;

    
    function formatDOB(dob) {
        if(!dob) 
            return null;
        let parts = dob.split('/'); 
        if(parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
        return dob;
    }
    console.log(frontdata);
    let name = frontdata.name;
    let ano = frontdata.adhaar_number; 
    let gen = frontdata.gender;
    let dob = formatDOB(frontdata.dob); 
    let address = backdata.address;
    let picurladf = pic1Url;
    let pic2urladb = pic2Url;

    console.log("Name =", name);
    console.log("Aadhaar =", ano);
    console.log("DOB =", dob);  

    mysqlCon.query(
        "insert into needyss(emailid,mobile,name,aadharcardno,gender,dob,address,fronturl,rearurl) values(?,?,?,?,?,?,?,?,?)",
        [email, mobile, name, ano, gen, dob, address, picurladf, pic2urladb],
        function (err) {
            if (err == null) 
                resp.send("badhaaaaaaiiiii");
            else
                 resp.send(err.message);
        }
    );
});