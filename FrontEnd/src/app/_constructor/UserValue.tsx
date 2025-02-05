'use server'
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import { defaultErro, ErroType, newLoginUser, NewUserData, UserType } from "./_Types";
let User: UserType | defaultErro | null = null;

type JwtPayLoad = {
  id: string;
  TokenUser: string
}

async function LoginUser( {UserName, Password}: newLoginUser): Promise<UserType | ErroType> {

    const response = await fetch("http://localhost:3000/user/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        UserName: UserName,
        Password: Password,
      })
    });
    
    const result: UserType | null = await response.json();
    if(result === null){
      const erro = ({id: Date.now(), message: 'Usuário ou senha não identificados no banco de dados'})
      return erro
    }else{

      const jwtPass = process.env.JWT_PASS ?? 'minha-senha';
    
  
      const token = jwt.sign({ id: result.ID, TokenUser: result.Token }, jwtPass, { expiresIn: '1h' });  
  
      const cookieStore = await cookies();
  
      cookieStore.set('TaskDefine-Token', token, { maxAge: 60 * 60 });
  
      User = result
      return result
    }
}


// async function LoginUserToken(Token: string) {
//   try {

//     const jwtPass = process.env.JWT_PASS ?? 'minha-senha';
//     console.log('token in LoginUser: ',Token)
//     if(Token){
//       const {id, TokenUser} = jwt.verify(Token, jwtPass) as JwtPayLoad
//       console.log('id get: ', id)
//       const methods = {
//         method: "GET",
//         headers: {
//           "Content-Types": "application/json",
//           "Authorization": `${TokenUser}`
//         },
  
//       };
  
//       const res = await fetch(`http://localhost:3000/user/${id}`, methods);
  
//       const data: UserType | defaultErro = await res.json();
  
//       User = data
//     }
//   } catch (e) {
//     console.error(e);
//   } finally {
//     return User;
//   }
// }

async function getLogedLocal(token: string){
  try {

    const jwtPass = process.env.JWT_PASS ?? 'minha-senha';

    if(token){
      
      const {id, TokenUser} = jwt.verify(token, jwtPass) as JwtPayLoad

      const methods = {
        method: "GET",
        headers: {
          "Content-Types": "application/json",
          "Authorization": `${TokenUser}`
        },
  
      };
  
      const res = await fetch(`http://localhost:3000/user/${id}`, methods);
  
      const data: UserType | defaultErro = await res.json();
      
      User = data
    }
  } catch (e) {
    console.error(e);
  } finally {
    return User;
  }
}



async function LogoutLocalUser() {
  User = {
    ID: -1,
    UserName: "Guest",
    Password: "",
    Token: "",
    Email: "",
    created_at: new Date(),
    my_tasks: [],
  };
  const cookStore = await cookies();
  cookStore.delete('TaskDefine-Token')
  return true
}


async function RegistratUser(NewUser: NewUserData){

  const {Username, Email} = NewUser
  try{
    
    const methods = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        Username: Username,
        Email: Email,
      })
    };
    
    const res = await fetch("http://localhost:3000/user", methods);

    if(res.status == 500){
      return 500
    }else if(res.status == 200){
      return 200
    }else{
      return 0
    }

  }catch(e){
    console.error('Erro: ',e)
  }
}

async function EditUser(NewEdit: {
  ID: number;
  UserName: string;
  Password: string,
  Email: string,
}){ 
  let retorno = false
  try{
    const res = await fetch(`http://localhost:3000/user/${NewEdit.ID}`,{
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Username: NewEdit.UserName,
        Password: NewEdit.Password,
        Email: NewEdit.Email
      })
    })
    const data = await res.json()
    if (data){
      retorno = true
    }
  }catch(e){
    console.error(e)
  }finally{
    return retorno
  }

}

export {
  LoginUser,
  getLogedLocal,
  LogoutLocalUser,
  RegistratUser,
  EditUser,
  // LoginUserToken
};
