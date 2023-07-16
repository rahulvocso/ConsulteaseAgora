import { IonModal,IonBackdrop,IonButton, IonContent,IonNote, IonHeader, IonPage, IonRouterLink, IonTitle, IonToolbar } from '@ionic/react';
import { IonSelect,IonSelectOption, IonSearchbar, IonCheckbox,IonImg,IonItem,IonLabel,IonInput, IonRow,IonCol,IonIcon,useIonToast} from '@ionic/react';
import appLogo from '../theme/assets/app-logo.svg';
import security_c from '../theme/assets/security.svg';

import { personOutline ,callOutline,checkmarkCircleOutline,warningOutline } from 'ionicons/icons';

import React, {Link, useState,useEffect } from 'react';
import {useHistory} from "react-router-dom"; 
import { Header } from "../components/Header";
import useFetch from "../hooks/useFetch";

 
import './ProfessionalCategories.css';

const ProfessionalCategories = () => {
  const history=useHistory();
  const [presentToast]=useIonToast();
  const [keyword,setKeyword]=useState("");
  const [categoriesMaster,setCategoriesMaster] =useState([]);
  const [categoriesChecked,setCategoriesChecked] =useState([]);
  const [categories,setCategories] =useState([]);
  const [data,setData] =useState({
    _id:"",
    name:"",
    order:0
  });

  const {get,post,loading}=useFetch('https://callingserver.onrender.com/api/v1/');

  useEffect(() =>{
    // fetch categories
    get("category/list",{"auth_token":localStorage.getItem("auth_token")})
    .then(data=>{
        // populate info in form for user selection
        setCategoriesMaster([
          ...data.body.data
        ]);
        setCategories([
          ...data.body.data
        ]);
    });

     // fetch previously saved categories for the user...
     get("user/categories",{"auth_token":localStorage.getItem("auth_token")})
     .then(data=>{
         // store preselected categories
         setCategoriesChecked([...data.body]);
     });

  },[]);

   


  useEffect(() => {
    let tempSearchResult = categoriesMaster.filter(ele => ele.name.toLowerCase().includes(keyword.toLowerCase()))
    setCategories([...tempSearchResult]);
},[keyword])

  const handleCategorySearch=(e)=>{
      setKeyword(e.target.value);
       
  }

  const handleItemCheck=(e)=>{
    let newData=[...categoriesMaster];
    let checkedItem=newData.filter(arr => arr._id.includes(e.target.value));
    checkedItem[0].checked=e.target.checked;

    let targetItem=checkedItem.map(({checked,active,order,stats,...rest}) => ({...rest}));


    if (e.target.checked){
      if (categoriesChecked.length>=5)
      {
        presentToast({
          message:"Can't select more than 5 categories. Only select categories most relevant to you.",
          duration: 4000,
          icon:warningOutline,
          color: "warning"
        });
      }{
         setCategoriesChecked([...categoriesChecked,targetItem[0]])
      }
      
    }
    else
    {
      let newData=categoriesChecked.filter((e) => {
         if (e._id!=targetItem[0]._id)
          return e;
       })
      setCategoriesChecked([...newData]);
    }
  }
   
    
  const handleCategorySave = (e) => {
        // to be modified...
       // let newData=categoriesChecked.map(({checked,active,order,stats,...rest}) => ({...rest}));
        
    
        //console.log("Call the Update User API",localStorage.getItem("auth_token"))
      
        post("user/updateProfessionalCategories",
            {"categories":categoriesChecked},
            {"auth_token":localStorage.getItem("auth_token")})
          .then(data=>{
              //console.log(data);
              if(data.status==200){
                presentToast({
                  message:data.message,
                  icon:checkmarkCircleOutline,
                  tramslucent:true,
                  duration:2000,
                  color:"primary"
                });
                // take the user to next screen
                history.push("/professionalinfo");
              }
                
              else
              presentToast({
                message:data.message,
                duration: 4000,
                icon:warningOutline,
                color: "danger"
              });
              
          })
     
      
  };

  function isCategoryChecked(c){
    let index = categoriesChecked.findIndex((cc)=>{
      return (cc._id==c._id)
    });
    return   index>=0 ? true : false;
  }

   

  return (
     <IonPage  >

<Header type="accountwizard" title="Select categories"  handleRight={handleCategorySave} />
<IonNote className="ion-margin">
  Choose categories ( upto 5 ), which best describe your area of expertise.
  </IonNote>
  <IonSearchbar onIonChange={(e) =>handleCategorySearch(e)} value={keyword} animated placeholder="Search categories"></IonSearchbar>
      <IonContent>
        <IonRow>
          <IonCol className="personalInfo-form">
         


      {categories.map((cat, key) => {
                  return (
                    <IonItem onClick={(e) => handleItemCheck(e)} key={key}  lines="none" >
                      <IonCheckbox slot="start" value={cat._id} checked={isCategoryChecked(cat)}  ></IonCheckbox>
                      <IonLabel>{cat.name}</IonLabel>
                     </IonItem>
                  )
                  })}
    
 


             
                


          </IonCol>
        </IonRow>
      </IonContent>
      <IonButton disabled={categoriesChecked.length>5 || categoriesChecked.length<1 ?true:false} className="ion-margin" onClick={(e) =>handleCategorySave(e)} >Save & Continue</IonButton>


    </IonPage>

      

     
  );
};

export default ProfessionalCategories;
