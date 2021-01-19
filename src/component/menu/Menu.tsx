import React from 'react' 
import styles from './index.module.scss'
import cn from 'classnames'

                            

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

export const Menu:React.FC = ()=>{
    return(
        <div className = {styles.menu}>
            <Header/>
        </div>
    )
}
const Header:React.FC = ()=>{
    const ref = React.useRef<HTMLUListElement>(null);
    const [dayData,setDayData] = React.useState<string[][]>(getDayData()[0]);
    const [currentDay,setCurrentDay] = React.useState<string[]>(getDayData()[1]);
    const handleDate = (e:React.MouseEvent<HTMLLIElement, MouseEvent>)=>{
        setCurrentDay(dayData[parseInt(e.currentTarget.lastElementChild?.id as string)]);
    }
    const reDirectToday = ()=>{
        setCurrentDay(dayData[1000]);
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
            let distance:number = e.clientX - ref.current!.offsetLeft - origin;
            ref.current!.scrollLeft -= distance;
        })
    },[])
    return(
        <div className = {styles.header}>
                    <div className={styles.title}>
                        <div>{currentDay[0] +"."+currentDay[1]}</div>
                        <div className={styles.todayButton} onClick = {()=>reDirectToday()}>今</div>    
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
                                                                        [styles.selected]:currentDay === e
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



