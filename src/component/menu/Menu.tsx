import React from 'react' 
import styles from './index.module.scss'
import cn from 'classnames'
import { context } from '../../App';
import ReactDOM from 'react-dom';
import { url } from 'inspector';
import { couldStartTrivia } from 'typescript';

                            
export const Menu:React.FC = ()=>{
    return(
        <div id = "menu" className = {styles.menu} >
            <Header/>
            <Content/>
        </div>
    )
}





const getDayData = ():any=>{
    let data:string[][] = [];
    let currentDay:string[] = [];
    const weekSet = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
    for(let i = -1000;i <=1000;i++){
        let date = new Date();
        date.setDate(date.getDate() + i);
        let year:string = date.getFullYear().toLocaleString();
        let mounth:string = (date.getMonth()+1).toLocaleString();
        let datee:string = date.getDate().toLocaleString();
        let day:string = weekSet[date.getDay()];
        data.push([year,mounth,datee,day]);
        if(i === 0){
            currentDay = [year,mounth,datee,day];
        }
    }
    return [data,currentDay];
}
const Header:React.FC = ()=>{
    //@ts-ignore
    const {day,setDay} = React.useContext(context);
    const ref = React.useRef<HTMLUListElement>(null);
    const [dayData,setDayData] = React.useState<string[][]>(getDayData()[0]);
    const handleDate = (e:React.MouseEvent<HTMLLIElement, MouseEvent>)=>{
        setDay(dayData[parseInt(e.currentTarget.lastElementChild?.id as string)]);
    }
    const reDirectToday = ()=>{
        setDay(dayData[1000])
        ref.current!.scrollLeft = ref.current!.scrollWidth/2 - ref.current!.clientWidth/2;
    }
    React.useEffect(()=>{
        reDirectToday();
        ref.current!.scrollLeft = ref.current!.scrollWidth/2 - ref.current!.clientWidth/2;
        let origin:number;
        ref.current!.addEventListener('mousedown',function(e){
            origin= e.clientX - ref.current!.offsetLeft;
        }) 
        ref.current!.addEventListener('mouseup',function(e){
            let distance:number = e.clientX  - ref.current!.offsetLeft - origin;
            ref.current!.scrollLeft -= distance;
        });
        ref.current!.addEventListener('touchstart',function(e){
            origin= e.touches[0]!.clientX - ref.current!.offsetLeft;
        }) 
        ref.current!.addEventListener('touchend',function(e){
            let distance:number = e.changedTouches[0]!.clientX  - ref.current!.offsetLeft - origin;
            ref.current!.scrollLeft -= distance;
        });

    },[])
    return(
        <div className = {styles.header}>
                    <div className={styles.title}>
                        <Login/>
                        <div className = {styles.Title} >{ day[0] ==="" ? "":day[0] +"."+day[1]}</div>
                        <div className = {styles.todayButton} onClick = {()=>reDirectToday()}>今</div>    
                    </div>
                    <ul ref = {ref}>  
                        {dayData.map((e,i)=>{
                            return(  
                                    <li onClick = {(e)=>{handleDate(e)}} key = {i} >
                                        <div>{e[3]}</div>
                                        <div    id={i.toString()}
                                                className = {  cn( 
                                                                    styles.dateCircle,
                                                                    {
                                                                        [styles.selected]:day === e
                                                                    }
                                                                )
                                                            }
                                        >{e[2]}</div>
                                    </li>
                            )
                        })}  
                    </ul>

        </div>
    )
}

const Login:React.FC = ()=>{
    //@ts-ignore
    const {data,setUser,user} = React.useContext(context);
    const [vis,setVis] = React.useState<boolean>(false);
    const [username,setUsername] = React.useState<string>('');
    const [password,setPassword] = React.useState<string>('');
    const loginHeadRef = React.useRef<HTMLDivElement>(null);
    const HeadRef = React.useRef<HTMLDivElement>(null);
    const outHeadRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(()=>{
        const headerVis = (ref:React.RefObject<HTMLDivElement>,obj:string):void =>{
            if(data[obj] !== undefined){
                let urll:string = data[obj]['head'];
                ref.current!.style.background = 'url('+urll+') no-repeat';
                ref.current!.style.backgroundSize = '100% auto'
            }else{
                if(ref.current){
                    (ref.current!.style as CSSStyleDeclaration).background = '';
                }
            }
        }
        headerVis(HeadRef,user);
        headerVis(outHeadRef,user);
        headerVis(loginHeadRef,username);

    },[username,user,data])
    return(
        <div>
            <div    
                    ref = {HeadRef}
                    className  = {styles.login}
                    onClick = {()=>{setVis(true)}}
            >
            </div>
            <MenuModel visible={vis && !user} >
                        <div 
                            ref = {loginHeadRef}
                            className  = {styles.loginHeader}
                        >
                            <div className = {styles.closeButton} onClick = {()=>{setVis(false)}}></div>
                        </div>
                        <input type="text" placeholder = 'username' onChange = {(e)=>{
                                                                                    setUsername(e.currentTarget.value);
                                                                                }}
                                value = {username}                                                
                                                                                />
                        <input type="password" placeholder = 'password' value = {password} onChange = {(e) =>{setPassword(e.currentTarget.value);}}/>
                        <div className = {styles.loginButton} onClick = {()=>{
                                                                            if(data[username] && data[username]['password'] === password){
                                                                                window.sessionStorage.setItem('user',username);
                                                                                setUser(username);
                                                                                setVis(false);
                                                                                setUsername('');
                                                                                setPassword('');
                                                                                // var FileSaver = require('file-saver');
                                                                                // var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
                                                                                // saveAs(blob, "hello world.txt");
                                                                            }
                                                                        }}
                        >Login</div>
            </MenuModel>
            <MenuModel visible = {vis && user}>
                        <div 
                            ref = {outHeadRef}
                            className  = {styles.loginHeader}
                        >
                            <div className = {styles.closeButton} onClick = {()=>{setVis(false)}}></div>
                        </div>
                       <div style = {{marginBottom:'10px',color:'white'}}>{user}</div>
                        <div className = {styles.loginButton} onClick = {()=>{
                                                                                window.sessionStorage.setItem('user','');
                                                                                setUser('');
                                                                                setVis(false);
                                                                        }}
                            style = {{width:'100px'}}
                        >Logout</div>

            </MenuModel>
        </div>
       
    )
}
// `${data[tempUser] === undefined ? '':data[tempUser]['head']}`
type modelType = {
    visible?:boolean,
}
export const MenuModel:React.FC<modelType> = ({visible = false,children})=>{
    if(!document.getElementById('menu')){
        return null;
    }
    return ReactDOM.createPortal(
        <div    className = {
                                cn(
                                    styles.menuModel,
                                    {
                                        [styles.modelVis]:visible
                                    }
                                    
                                )
                }>
            <div className = {styles.content}>
                {children}                
            </div>
        </div> 
        
    ,document.getElementById('menu') as Element)

}


const Content:React.FC = ()=>{
    //@ts-ignore
    const { day } = React.useContext(context);
    const [vis,setVis] = React.useState<boolean>(false);
    return(
        <div className = {styles.Content}>
            <div className = {styles.footer}>
                <div className = {styles.addButton} onClick = {()=>{setVis(vis=>!vis)}}></div>
            </div>
            <AddModel visible = {vis}></AddModel>
        </div>
    )
}


export const AddModel:React.FC<modelType> = ({visible = false,children})=>{ 
    const ref = React.useRef<HTMLDivElement>(null);
    const [vis,setVis] = React.useState<boolean>(visible);
    const [isClosing, setIsClosing] = React.useState(false);
    const cnt = React.useRef(false);
    React.useEffect(()=>{
        if(isClosing){
            const timerId = setTimeout(() => {setVis(false);},300);
            return (): void => {
              clearTimeout(timerId);
              setIsClosing(false);
            };
        }else{
             cnt.current === false ? cnt.current = true:setVis(true);
        }
    },[visible,isClosing]) 
    if(!document.getElementById('menu')){
        return null;
    }
    return ReactDOM.createPortal(
        <div    className = {
                                cn(
                                    styles.menuModel,
                                    {
                                        [styles.modelVis]:vis
                                    }                       
                                )
                }
                ref = {ref}
                onClick = {(e)=>{   if(e.currentTarget === e.target){
                                        setIsClosing(true)}
                                    }
                                }
            >
            <div className = {
                                cn(
                                    styles.addContent,
                                    {
                                        [styles.slideIn]:!isClosing,
                                        [styles.slideOut]:isClosing
                                    }                       
                                )
                }>
                <div style = {{width:'40px',height:'5px',background:'rgb(240, 238, 245)',margin:'0 auto',borderRadius:'8px'}}></div>
                {children}                
            </div>
        </div> 
        
    ,document.getElementById('menu') as Element)

}





