import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { gql } from '@apollo/client';
import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import { client } from '../utils/client'
// import Logo from "./assets/img/foodies.gif"
import { useParams } from 'react-router-dom'
import './link.css';
import logo from './../assets/img/logo.gif';
import SocialMedia from './../assets/img/SocialMedia.png'
import { ReactSession } from 'react-client-session';
import validator from 'validator'

const GET_USER = gql`
  query MyQuery($name: String!)   {
    getUsersByUserName(name: $name) {
      name
      password
      userId
      email
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

ReactSession.setStoreType("localStorage");

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

function LinksProfile() {
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
  const {userUniqeName} = useParams();
  const [msg, setMsg] = useState('');
  const [copyText, setCopyText] = useState('');

  //Sign in
  const signIn = async (event) => {
    event.preventDefault();
    console.log("Signin")
    if(typeof(username) !== "undefined" && username &&
       typeof(password) !== "undefined" && password){
        const { loading, error, data } = await client.query({
          query: GET_USERNAME_PASSWORD, 
          variables: { name: username, password: password}
        });
      
        if (loading) (console.log("loading"));
      
        if (error)  {
          console.log(error);
          setError("Something went wrong");   
        };
          
        const res = data["getUsersByUserNameAndPassword"];
      
        console.log(res);
        if(res[0] !== undefined){
            // if(!userUniqeName){
            //   navigate(username);
            // }
            window.open("https://profilelinksnooras.netlify.app/"+res[0].name,"_self");
            setEmail(res[0].email);
            setUserId(res[0].userId);
            // console.log(res[0].email, res[0].userId);
            setOpenSignIn(false);
            fetchLinkDetails(res[0].userId);
            ReactSession.set('ProfileUser', res[0]);
            setError("");
        } else {
            setError("User Not Found")
            console.log("No")
        }
    } else {
      setError("All fields are required...");
    }
  }

  //Sign up
  const signUp = async (event) =>{
    event.preventDefault();
    console.log("signup")
    if(typeof(username) !== "undefined" && username &&
       typeof(password) !== "undefined" && password &&
       typeof(email) !== "undefined" && email){
        const { loading, error, data } = await client.mutate({
          mutation: INSERT_USER_DETAILS, 
          variables: { name: username, password: password, email: email}
        });
    
        if (loading) (console.log("loading"));
      
        if (error)  {
          console.log(error);
          setError("Something went wrong...");   
        };
          
        const res = data["insertUsers"];
      
        console.log(res);
        if(res.userId !== undefined){
            window.open("https://profilelinksnooras.netlify.app/"+res.name,"_self");
            setUserId(res.userId);
            // console.log(res.email, res.userId)
            setOpen(false);
            ReactSession.set('ProfileUser', res);
            setError("");
        } else {
            setError("Try again after sometimes. Signup fails.")
            console.log("No")
        }
    } else {
      setError("All fields are required...");
    }
  }

  //Sign out
  const signOut = () => {
    localStorage.clear();
    window.location.reload();
  }

  //Add link
  const addLink = async (event) =>{
    console.log("addLink");

    if(typeof(link) !== "undefined" && link &&
       typeof(linkName) !== "undefined" && linkName){
        if(validator.isURL(link)){
          const { loading, error, data } = await client.mutate({
            mutation: INSERT_LINK_DETAILS, 
            variables: { link: link, linkName: linkName, userId: userId}
          });
      
          if (loading) (console.log("loading"));
        
          if (error)  {
            console.log(error);
            setError("Something went wrong...");   
          };
            
          // console.log(data, "data");
          const res = data["insertLinks"];
        
          // console.log(res);
          if(res.id !== undefined){
              //Fetch link details of user by id
              fetchLinkDetails(userId);
              setOpenAddLink(false);
              setError("");
          } else {
              event.preventDefault();
              setError("Try again after sometimes. Add link fail.")
              console.log("Link not added");
          }
        } else {
          event.preventDefault();
          setError("Correct URL required");
        }
    } else {
      event.preventDefault();
      setError("All fields are required.");
    }
  }

  //fetch link details by id
  const fetchLinkDetails = async (userId) => {
    const { loading, error, data } = await client.query({
      query: GET_LINKS_BY_USERID, 
      variables: { userId: userId}
    });
  
    if (loading) (console.log("loading"));
  
    if (error)  {
      console.log(error);
      setError("Something went wrong");   
    };
      
    const res = data["getLinksByUserId"];
    if(res[0] !== undefined && res[0].id !== undefined){
      setLinkDetails(res);
    } else {
      setMsg("No Links found.")
      console.log("Link not loaded...");
  }
  }

  //fetch users deatils
  const fetchUserLinkDetails = async () => {
    // event.preventDefault();
    const { loading, error, data } = await client.query({
      query: GET_USER, 
      variables: { name: userUniqeName}
    });

    console.log(userUniqeName, "In fetchUserLinkDetails");

    if (loading) (console.log("loading"));
  
    if (error)  {
      console.log(error);
    };
      
    const res = data["getUsersByUserName"];
    if(res[0] !== undefined){
      fetchLinkDetails(res[0].userId);
  } else {
      setMsg("No details found for " + userUniqeName + " OR Invalid URL")
      console.log("No user details found...", userUniqeName);
  }

  }

  // if user login then fetch details  else if url have username
  if(userId){
    fetchLinkDetails(userId);
  } else if(userUniqeName && !linkDetails){
    console.log(userUniqeName, "loading link details");
    fetchUserLinkDetails();
  }

  //Copy text
  if(copyText){
    navigator.clipboard.writeText(copyText);
    setCopyText("");
  }

  // if session present
  // console.log(ReactSession.get('ProfileUser'), userId)
  if(ReactSession.get('ProfileUser') !== undefined && Object.keys(ReactSession.get('ProfileUser')).length !== 0 && (userId === undefined || userId === "")){
    const res = ReactSession.get('ProfileUser');
    setUserId(res.userId);
    setEmail(res.email);
    setUsername(res.name);
  }
  
  return (
    <div className=''>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
         <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
              <center> 
                {/* Sign in */}
                <img className="logoImage" 
                  src={logo}
                  alt="logo_image" width={200}></img>
              </center>
              <Input
                placeholder="Username" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                placeholder="Email" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                placeholder="Password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button className="btn mx-2" type="submit" onClick={signUp} style={{border: '#0097EF solid 1px', backgroundColor: '#e2eff7'}}>Sign Up</Button>
              {/* <Button className='mx-2' type="submit" onClick={signUp} style={{border: '3px solid rgb(205, 213, 248)'}}>Sign up</Button> */}
              <div className='text-danger'>
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
                {/* Sign up */}
                <img className="logoImage" 
                  src={logo}
                  alt="logo_image" width={200}>
                </img>
              </center>
              <Input
                placeholder="username" 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                placeholder="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button className="btn mx-2" type="submit" onClick={signIn} style={{border: '#0097EF solid 1px', backgroundColor: '#e2eff7'}}>Sign In</Button>
              {/* <Button className='mx-2' type="submit" aria-autocomplete='off' class='btn-group' onClick={signIn} style={{border: '3px solid rgb(205, 213, 248) ' }}>Sign In</Button> */}
              <div className='text-danger'>
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
              <div className='text-danger'>
                {error && (<p>{error}</p>)}
              </div>
          </form>
        </div>
      </Modal>

      <div className="loginContainer d-flex flex-sm-row flex-column justify-content-between m-4" style={{alignItems:'center'}}>
              <div>
                <img src={logo} className="App-logo" width='200' alt="logo"></img>
              </div>
            {userId ? (
              <div className='d-flex m-2'>
                <p className='my-auto'>USERNAME: {username}</p>
                <Button className="btn mx-2" onClick={() => setOpenAddLink(true)} style={{border: '#0097EF solid 1px', backgroundColor: '#e2eff7', fontSize: 18}}>ADD LINK</Button>
                <Button className="btn" onClick={() => signOut()} style={{border: '#0097EF solid 1px', backgroundColor: '#e2eff7', fontSize: 18}}>Logout</Button>
              </div>
              ):(
              <div className='d-flex m-2'>
                <Button className="btn mx-2" onClick={() => setOpenSignIn(true)} style={{border: '#0097EF solid 1px', backgroundColor: '#e2eff7', fontSize: 18}}>Sign In</Button>
                <Button className="btn" onClick={() => setOpen(true)} style={{border: '#0097EF solid 1px', backgroundColor: '#e2eff7', fontSize: 18}} >Sign Up</Button>
              </div>
            )}    
      </div>
      {msg && 
      <div className='d-flex justify-content-center m-2 text-info'>
        {msg}
      </div>}
      
        {linkDetails ? (Object.keys(linkDetails).map((key) => (
          // <p key={key}>
          //   {linkDetails[key].linkName}
          //   {linkDetails[key].link}
          // </p>
          <div className='d-flex justify-content-center m-2' key={key}>
            <div className="linkdiv card">
              <div className="card-header text-uppercase">
                <h4 className='m-2'>{linkDetails[key].linkName}</h4>
              </div>
              <div className="d-flex card-body text-secondary justify-content-between">
                <h4 className="linkUrl card-text m-2">
                  <a href={linkDetails[key].link} target="_blank" rel="noopener noreferrer">
                  {linkDetails[key].link}
                  </a>
                </h4>
                <Button className='button-all' onClick={() => setCopyText(linkDetails[key].link)}><img src="https://img.icons8.com/ios-glyphs/20/000000/copy.png" alt="img"/></Button>
              </div>
            </div>
          </div>
        ))): (
          <div>
            <div className='justify-content-center text-center d-block text-uppercase'>
              <img src={SocialMedia} className="social-logo img-fluid" alt="logo"></img>
              <h1>Create your own profile link</h1>
              <h3 style={{color: '#77B255'}}>Connect your all link in one place</h3>
            </div>
            <div style={{backgroundColor: '#e2eff7', width:'100%', bottom:'0'}}>
              <center>Developed by @<a href="https://noorasfatima.netlify.app/">Nooras Fatima</a></center>
              <center>Copyright © 2021 Nooras Fatima. All Rights Reserved.</center>
            </div>
          </div>
        )}
        {/* {(!userId || !linkDetails) && 
        <>
         </>
        }  */}
    </div>
  );
}

export default LinksProfile;
