import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input, TextareaAutosize } from '@material-ui/core';
import { client } from '../utils/client'
// import Logo from "./assets/img/foodies.gif"

// var name = "nooras";
const GET_QUERY = gql`
  query MyQuery($name: String!)   {
    getUsersByUserName(name: $name) {
      name
      password
    }
  }
`;

const GET_USERNAME_PASSWORD = gql`
  query MyQuery($name: String!, $password: String!)   {
    getUsersByUserNameAndPassword(name: $name, password: $password) {
      name
      password
      email
      userId
    }
  }
`;

const INSERT_USER_DETAILS = gql`
    mutation MyMutation($name: String!, $password: String!, $email: String!) {
      insertUsers(email: $email, name: $name, password: $password) {
        email
        name
        password
        userId
      }
}
`

const INSERT_LINK_DETAILS = gql`
    mutation MyMutation($link: String!, $linkName: String!, $userId: String!) {
      insertLinks(link: $link, linkName: $linkName, userId: $userId) {
        id
        link
        linkName
        userId
      }
}
`
const GET_LINKS_BY_USERID = gql`
  query MyQuery($userId: Int!)   {
    getLinksByUserId(userId: $userId) {
      id
      link
      linkName
      userId
    }
  }
`;

function getModalStyle(){
  const top = 50;
  const left = 50;

  return{
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper:{
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
  }
}));



// const signIn = async (event) =>{
// }




function LinksProfile(name) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openAddLink, setOpenAddLink] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState("");
  const [linkName, setLinkName] = useState('');
  const [link, setLink] = useState('');
  const [linkDetails, setLinkDetails] = useState('');
    // console.log("hii", name["name"]);

  const signIn = async (event) => {
    event.preventDefault();
    console.log("Signin")
    // const n =  name["name"]
    console.log(username, password)
    const { loading, error, data } = await client.query({
      query: GET_USERNAME_PASSWORD, 
      variables: { name: username, password: password}
    });
  
    if (loading) (console.log("loading"));
  
    if (error)  {
      console.log(error);
      setError("Something went wrong");   
      // <pre>{JSON.stringify(error, null, 2)}</pre>
    };
      
    const res = data["getUsersByUserNameAndPassword"];
  
    console.log(res);
    if(res[0] !== undefined){
        console.log("YESS")
        setEmail(res[0].email);
        setUserId(res[0].userId);
        console.log(res[0].email, res[0].userId);
        setOpenSignIn(false);
        fetchLinkDetails();
    } else {
        setError("User Not Found")
        console.log("No")
    }
  }

  const signUp = async (event) =>{
    event.preventDefault();
    console.log("signup")
    const { loading, error, data } = await client.mutate({
      mutation: INSERT_USER_DETAILS, 
      variables: { name: username, password: password, email: email}
    });

    if (loading) (console.log("loading"));
  
    if (error)  {
      console.log(error);
      setError("Something went wrong...");   
      // <pre>{JSON.stringify(error, null, 2)}</pre>
    };
      
    const res = data["insertUsers"];
  
    console.log(res);
    if(res.userId !== undefined){
        console.log("YESS")
        // setEmail(res[0].email);
        setUserId(res.userId);
        console.log(res.email, res.userId)
        setOpen(false);
    } else {
        setError("Try again after sometimes. Signup fails.")
        console.log("No")
    }
  }

  const signOut = () => {
    localStorage.clear();
    window.location.reload();
  }

  // if(id){
    console.log(userId);
  // }

  const addLink = async (event) =>{
    event.preventDefault();
    console.log("addLink");

    const { loading, error, data } = await client.mutate({
      mutation: INSERT_LINK_DETAILS, 
      variables: { link: link, linkName: linkName, userId: userId}
    });

    if (loading) (console.log("loading"));
  
    if (error)  {
      console.log(error);
      setError("Something went wrong...");   
      // <pre>{JSON.stringify(error, null, 2)}</pre>
    };
      
    const res = data["insertUsers"];
  
    console.log(res);
    if(res.id !== undefined){
        console.log("Link added...")
        // setEmail(res[0].email);
        // setId(res.);
        fetchLinkDetails();
        console.log(res.id, res.link)
        setOpenAddLink(false);
    } else {
        setError("Try again after sometimes. Add link fail.")
        console.log("Link not added");
    }
  }

  const fetchLinkDetails = async () => {
    // event.preventDefault();
    const userId = 1;
    const { loading, error, data } = await client.query({
      query: GET_LINKS_BY_USERID, 
      variables: { userId: userId}
    });
  
    if (loading) (console.log("loading"));
  
    if (error)  {
      console.log(error);
      setError("Something went wrong");   
      // <pre>{JSON.stringify(error, null, 2)}</pre>
    };
      
    const res = data["getLinksByUserId"];
    if(res[0].id !== undefined){
      console.log("Links loaded...")
      setLinkDetails(res);
      console.log(res)
  } else {
      setError("Link loading fail.")
      console.log("Link not loaded...");
  }
  }
  

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
         <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
              <center> 
                Sign in
                {/* <img className="logoImage" 
                  src={Logo}
                  alt="logo_image" width={300}></img> */}
              </center>
              <Input
                placeholder="Username" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button className='mx-2' type="submit" onClick={signUp} style={{border: '3px solid rgb(205, 213, 248)'}}>Sign up</Button>
              <div>
                {error && (<p>{error}</p>)}
              </div>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
         <div style={modalStyle} className={classes.paper}>
          <form className="app_signin" >
              <center>
                Sign up
                {/* <img className="logoImage" 
                  src={Logo}
                  alt="logo_image" width={300}>
                </img> */}
              </center>
              <Input
                placeholder="username" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button className='mx-2' type="submit" onClick={signIn} style={{border: '3px solid rgb(205, 213, 248)'}}>Sign In</Button>
              <div>
                {error && (<p>{error}</p>)}
              </div>
          </form>
        </div>
      </Modal>

      <Modal
        open={openAddLink}
        onClose={() => setOpenAddLink(false)}
      >
         <div style={modalStyle} className={classes.paper}>
          <form className="app_signin" >
              <center>
                Add Link
                {/* <img className="logoImage" 
                  src={Logo}
                  alt="logo_image" width={300}>
                </img> */}
              </center>
              <Input
                placeholder="Link Name" 
                type="text"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
              />
              <Input
                placeholder="Link URL" 
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <Button className='mx-2' type="submit" onClick={addLink} style={{border: '3px solid rgb(205, 213, 248)'}}>Add</Button>
              <div>
                {/* {error && (<p>{error}</p>)} */}
              </div>
          </form>
        </div>
      </Modal>

      <div className="loginContainer">
            {userId ? (
              <div>
                <p>{email}</p>
                <Button className="btn" onClick={() => signOut()} style={{border: '3px solid rgb(205, 213, 248)'}}>Logout</Button>
              </div>
              ):(
              <div>
                <p>{email} {userId}</p>
                <Button className="btn mx-2" onClick={() => setOpenSignIn(true)} style={{border: '3px solid rgb(205, 213, 248)'}}>Sign In</Button>
                <Button className="btn" onClick={() => setOpen(true)} style={{border: '3px solid rgb(205, 213, 248)'}}>Sign Up</Button>
              </div>
            )}    
      </div>
      {userId && (
        <div>
          <Button className="btn" onClick={() => setOpenAddLink(true)} style={{border: '3px solid rgb(205, 213, 248)'}}>ADD LINK</Button>
        </div>
      )}

      {linkDetails && 
      <div>
        {/* {linkDetails[0].linkName} */}
        {Object.keys(linkDetails).map((key) => (
          <p key={key}>
            {linkDetails[key].linkName}
            {linkDetails[key].link}
          </p>
        ))}
        {/* {
                  linkDetails.map((e, i) => {
                    <div>
                      hii
                      {i} {e.link}
                    </div>
                  })
        } */}
      </div>}
      
    </div>
  );
}

export default LinksProfile;
