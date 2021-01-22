import axios from 'axios';
import React, { useEffect } from 'react';
import './App.css';
import { MainPanel } from './component/MainPanel/MainPanel';
import { Menu } from './component/menu/Menu';

const useData = ()=>{
    const [data,setData] = React.useState<object>({});
    const [pending,setPending] = React.useState<boolean>(false);
    React.useEffect(()=>{
        const getData = async() =>{
            setPending(true);
            const res = await (await axios.get('../data.json'));
            setData(res.data);
            setPending(false);
        }
        getData();
        return () => {
        }
    },[])
    return [data,pending];
}
export const context = React.createContext({})
function App() {
    const [data,pending] = useData();
    const [day,setDay] = React.useState<string[]>(["","","",""]);
    const [user,setUser] = React.useState<string>(window.sessionStorage.getItem('user') as string);
    React.useEffect(()=>{
    },[])
    return (
        <div className="App">
            <context.Provider value={{
                data,
                day,
                setDay,
                user,
                setUser
            }}>
               <Menu/> 
            </context.Provider>
            
        </div>
    );
}

export default App;
