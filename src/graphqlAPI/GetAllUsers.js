import { useQuery } from '@apollo/client';
import { gql } from "graphql-tag"
// import { useQuery } from "@apollo/react-hooks"

//sample
const GET_QUERY = gql`
  query MyQuery   {
    getUsersList {
      name
      password
      userId
    }
  }
`;

function GetAllUsers() {
  const { loading, error, data } = useQuery(GET_QUERY);

  if (loading) return <p>Loading ...</p>;

  if (error) return (
    <pre>{JSON.stringify(error, null, 2)}</pre>
  );

  const res = data["getUsersList"];
  // const res = "njn";
  console.log(res);
  return (
    <pre>{res[0].name}</pre>
    // <div>hello</div>
  );
}

export default GetAllUsers;


// let headers = {};

// headers["Content-Type"] = "application/json";
// // headers["Authorization"] = process.env.REACT_APP_STEPZEN_API_KEY;
// headers["Authorization"] = "Apikey purral::stepzen.net+1000::17eec00a1cb0a4940a7aef4af9c47d1c7cdc9e50ca42378d2bfdaa84e83ecbb7";

// var graphql = JSON.stringify({
//   query: `query getUsersList{
//     getUsersList{
//         name
//         password
//         userId
//     }
// }`,
//   variables: {}
// })

// var requestOptions = {
// method: 'POST',
// headers: headers,
// body: graphql
// };

// const res = fetch("https://purral.stepzen.net/api/melting-skunk/__graphql", requestOptions)
// .then(response => response.text())
// .then(result => {return result})
// .catch(error => console.log('error', error));

// const res2 = res.toString();
// console.log("res", JSON.stringify(res, null, " "), res, JSON.stringify(res2, null, ''));

// function GetAllUsers() {
//   // const { loading, error, data } = useQuery(GET_QUERY);

//   // if (loading) return <p>Loading ...</p>;

//   // if (error) return (
//   //   <pre>{JSON.stringify(error, null, 2)}</pre>
//   // );

//   return (
//     // <pre>{JSON.stringify(data, null, 2)}</pre>
//     // <div>hello</div>
//   );
// }

// export default GetAllUsers;