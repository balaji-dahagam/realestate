const { connection } = require("../connection/connection");

exports.getLogin = (req, res) => {
  res.render("agent/login");
};

exports.postLogin = (req, res) => {
  // get params ;
  const username = req.body.username;
  const password = req.body.password;
  // console.log(username, password);

  connection.query(
    // `select * from login where username = '${username}' and password = '${password}';`,
    `select * from agent where NAME = '${username}' and PASSWORD = '${password}';`,
    (err, rows, fields) => {
      // console.log(rows[0]);
      if (!err) {
        if (rows.length > 0) {
          console.log(rows[0].ID);
          req.session.user = username;
          req.session.agentId = rows[0].ID;
         console.log(req.session);

          res.redirect("/agent");
        } else {
          console.log("1wrong username or password");
          res.redirect("/agent/login");
        }
      } else {
        console.log("2wrong username or password");
      }
    }
  );
  // perform check on

  // if yes set up an xookies and session
};

exports.getAgenthome = (req, res) => {
  let agentInfo;
  let agentId = req.session.agentId;
  let propertyDetails;
  let property_sold_rented;
  let buyerDetails;

  if(!req.session.agentId){
    res.redirect('/agent/login');
  }
  connection.query(
    `SELECT * FROM agent WHERE ID = '${agentId}' ; 
     select * from property WHERE AGENT_ID = '${agentId}';
     select PID,AREA,STREET,STATUS,TAG from property where (STATUS = 'CLOSED' or STATUS = 'OPEN') and AGENT_ID = '${agentId}'  ;
     select BUYER_NAME from deal where AGENT_ID = '${agentId}';`,
    (err, rows, fields) => {
      agentInfo = rows[0];
      propertyDetails = rows[1];
      console.log("agentinfo d", agentInfo);
     
      property_sold_rented = rows[2];
      buyerDetails = rows[3];
      console.log(rows[3]);
      
      res.render("agent/agentHome", {
        info: agentInfo,
        pDetails: propertyDetails,
        sold_rented : property_sold_rented,
        bDetails : buyerDetails
      });
    }
  );
};
exports.postUpdateProperty = (req,res) => {
  const propertyId = req.params.propertyId;
  const agentId = req.session.agentId;
  const status  = req.body.status;
  if(!agentId){
    res.redirect('/agent/login');
    return;
  }

  const query = 'update property set STATUS=? where PID=? AND AGENT_ID=?';
  // select * from property where PID = '${propertyId}';
  // select * from agent where ID = '${agentId};`;

  connection.query(query,[status,propertyId,agentId,],(err,rows,field) => {
    if(!err){
      res.redirect('/agent')
      
    }else{
      console.log(err);
    }
  })

  console.log(propertyId, agentId, status);
};
