import React, { useEffect, useRef } from "react";
import { FlexDiv } from "../styles/globalStyleComponent";
import { DashboardContext } from "../context/DashboardContext";

import { MdDeleteForever } from "react-icons/md";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import DataTable, { TableColumn } from "react-data-table-component";

import { Button } from "./Button";
import { Input, SelectGeneral, MultipleSelect, MultipleChildSelect, ImageMultipleSelect, UploadImage } from "./Input";
  
// define type for parent list
export type ParentPageListPartialType = {
    pageId: number 
    pageName: string 
    pageAlias: string
}


// define error message type
type CreatePageErrorMessageType = {
    descriptionError?:string
    aliasNameError?:string
    parentPageError?:string
    pageTypeError?:string
}

// define image state type
type ImageFileStateType = {
    image?:File
    imageName:string
    imagePath:string
    justSelected:boolean
};

// define type for data table--- lets use the properties of pageWithParentName as it is already defined.
export type DataRowType = {
    pageId:number
    pageName:string
    pageAlias:string
    // hasParent:string
    // hasParentId:number
    description:ReactQuill.Value
    imageName:string
    imageUrl:string
    pageType:string
    pageLinkList:number[]
    pageImageList:number[]
    pageChildList:{childId:number,childOrder:number}[]
}

// define pageType = link list type
type pageTypeLinkListType = {
    pageId:number
    pageAlias:string
    isSelected:boolean
    isActive:boolean // if true, contribute to hide or deactive the link capsule
}

// define pageType = image list type
type pageTypeImageListType = {
    pageId:number
    pageAlias:string
    imageName:string
    // imageUrl:Promise<string>
    imageUrl:string
    isSelected:boolean
}

// define pageType = page / page-main-nav
type pageTypePageAndPageMainNavListType = {
    pageId:number
    pageAlias:string
    pageOrder:number
    isSelected:boolean
    isActive:boolean
}

export const CreatePage = ()=>{
    // reference to select parent 
    // const selectParentRef = useRef<HTMLElement>(null);

    // reference to child multiple select
    const childContainerRef = useRef<HTMLElement>(null);

    // reference to link multiple select
    const linksContainerRef = useRef<HTMLElement>(null);

    // reference to image multiple select
    const imageContainerRef = useRef<HTMLElement>(null);

    // reference to image uploader
    const pageImageUploaderRef = useRef<HTMLElement>(null);

    // get the dashboard context
    const { dashboardState, savePage, getImageUrl, deletePage, deleteImage, deleteImageFromStorage } = React.useContext(DashboardContext);

    // define state to associate to error message
    const [createPageErrorMessage, setErrorMessage] = React.useState({} as CreatePageErrorMessageType);

    // to store the pageId being edited
    const [pageIdBeingEdited, setPageIdBeingEdited] = React.useState(null as null | number);

    // to det the page title while editing the page
    const [pageName, setPageName] = React.useState('');

    // define state alias to store the value of page alias generated
    // the pageAlias should be unique and be used to get specific page based on the pageAlias name
    // we will use setPageAlias to set the pageAlias to the form while editing
    const [pageAlias, setPageAlias] = React.useState('');

    // holds the original alias of the page being edited
    const [originalAliasBeforeEditing, setOriginalAliasBeforeEditing] = React.useState('');

    // define state description to store the value of react quill
    // we will use setDescription to set the page description to the form while editing
    const [description, setDescription] = React.useState('' as ReactQuill.Value);

    // populate the parent page list 
        // also make a structure for data-table and editing
    const [pageWithParentName, setPageWithParentName] = React.useState( [] as DataRowType[]);

    // set page type
    const [pageType, setPageType] = React.useState('');

    // set list of link page
    const [pageTypePageAndPageMainNavList, setPageTypePageAndPageMainNavList] = React.useState([] as pageTypePageAndPageMainNavListType[]);

    // set list of link page
    const [pageTypeLinkList, setPageTypeLinkList] = React.useState([] as pageTypeLinkListType[]);

    // set list of page images
    const [pageTypeImageList, setPageTypeImageList] = React.useState([] as pageTypeImageListType[]);

    // to store the selected image url.
    const [imageFile, setImageFile] = React.useState({} as ImageFileStateType);

    // to disable CREATE PAGE button.
    const [disableCreatePageBtn, setDisableCreatePageBtn] = React.useState(false);  

    // to track page edit mode.
    const [isEditMode, setEditMode] = React.useState(false);

    // to set the loading sign in data-table
    const [loading, setLoading] = React.useState(true);

    /**
     * To update the page name on input change event and to create and update the alias name
     * @author Anil
     */
    const updatePageName = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setPageName(e.target.value);
        makeAlias(e);
    }

    /**
     * Generate the page alias form Page title
     * @param e 
     * @author Anil
     */
     const makeAlias = (e:React.ChangeEvent<HTMLInputElement>)=>{
        // console.log(e.target.value);
        var tempAlias = e.target.value.trim().replace(/\s+/g,'-').toLowerCase();
        if(pageWithParentName){
            // to check if alias name already exists or not
            let isAliasExist = pageWithParentName.find((list)=> list.pageAlias === tempAlias);

            if((isAliasExist && !isEditMode) || (isEditMode && isAliasExist && (tempAlias !== originalAliasBeforeEditing))){
                setErrorMessage({aliasNameError:'Alias name already exists.'});
                setDisableCreatePageBtn(true);
            }else{
                setErrorMessage({aliasNameError:''})
                setDisableCreatePageBtn(false);
            }
        }
        setPageAlias(()=>tempAlias);
    }

    /**
     * Updates the page type i.e. page and link
     * @param e react change event
     * @author Anil
     */
    const updatePageType = (e:React.ChangeEvent<HTMLSelectElement>)=>{
        // if the pageType is being converted into "page" or "page-and-main-nav", we need to make sure during the transition from link into other pages, the pageTypeLinkList do not include self as "link"
        if(isEditMode && e.target.value !== 'link'){
            const pageBeingEdited = pageWithParentName.find((page)=>page.pageId === pageIdBeingEdited);
            // if previous pageType is "link" then remove it from the list of pageTypeLinkList.
            if(pageBeingEdited?.pageType === 'link'){
                // setErrorMessage({pageTypeError:'Delete the existing links before converting into Link type.'})

                let tempPageTypeLinkList = pageTypeLinkList.map((list)=>{
                    if(list.pageId === pageIdBeingEdited){
                        list.isActive = false;
                    }
                    // if ids exists then alter the state of existing ids else reset to false
                    return list;
                    
                });
                
               setPageTypeLinkList(tempPageTypeLinkList);
            }
        }
        setPageType(e.target.value);
    }

    /**
     * To capture the quill editor value
     * @param value of quill editor
     * @author Anil
     */
    const updateDescription = (value:ReactQuill.Value)=>{
        setDescription(value);
    }

    /**
     * To select and preview the image selected
     * @param selectedFiles from the input type file
     * @description Upon selecting an image, it extracts image, image name, and local relative path of image to generate the preview.
     * @author Anil
     */
    const selectImage = async (selectedFiles: FileList)=>{
        // get image file
        let tempImg = Array.from(selectedFiles)[0];
        // set the imageFile state
        if(tempImg){
            // get image url
            let tempImgUrl = URL.createObjectURL(tempImg);
            setImageFile({image:tempImg, imageName:tempImg.name, imagePath:tempImgUrl, justSelected:true});
        }else{
            setImageFile({} as ImageFileStateType);
            // get previous image
            const pageBeingEdited = pageWithParentName.find((page)=>page.pageId === pageIdBeingEdited);
            if(pageBeingEdited?.imageName){
                // get page image url relative to the firebase storage
                const imageUrl = await getImageUrl(pageBeingEdited.imageName);
                setImageFile({imageName:pageBeingEdited.imageName,imagePath:imageUrl, justSelected:false});
            }
        }
    }

    /**
     * check if the image is just selected or old one then deletes from local and firebase storage.
     * @param e 
     * @author Anil
     */
    const onDeleteImageBtnClick = async (e:React.MouseEvent)=>{
        e.preventDefault();
        if(window.confirm("Do you really want to delete the Image?") === true){
            if(isEditMode && !imageFile.justSelected){
                const isImageDeleted = await deleteImage(pageIdBeingEdited!, imageFile.imageName);
                console.log(isImageDeleted);
                if(isImageDeleted)
                    console.log('Image deleted successfully.');
                else    
                    console.log('Failed to delete successfully.');
                
                setImageFile({} as ImageFileStateType); 
            }else if(isEditMode && imageFile.justSelected){
                setImageFile({} as ImageFileStateType); 
                // get previous image
                const pageBeingEdited = pageWithParentName.find((page)=>page.pageId === pageIdBeingEdited);
                if(pageBeingEdited?.imageName){
                    // get page image url relative to the firebase storage
                    const imageUrl = await getImageUrl(pageBeingEdited.imageName);
                    setImageFile({imageName:pageBeingEdited.imageName,imagePath:imageUrl, justSelected:false});
                }
            }else{
                setImageFile({} as ImageFileStateType); 
            }
        }
    }


    /**
     * To collect and submit the required fields for a new page
     * @description It will create new page or update existing page based on the pageIdBeingEdited value.
     * If pageIdbeingEdited is null it will create new page.
     * Else it will update existing page based on the corresponding pageIdBeignEdited.
     * @param e 
     * @author Anil
     */
    const createOrUpdatePage = async (e:React.SyntheticEvent)=>{
        e.preventDefault();

        // delete previous image
        if(isEditMode && pageIdBeingEdited && imageFile.justSelected){
            const pageBeingEdited = pageWithParentName.find((page)=>page.pageId === pageIdBeingEdited);
            if(pageBeingEdited?.imageName && pageBeingEdited.imageName.length > 0)
                await deleteImageFromStorage(pageBeingEdited?.imageName!);
        }

        // get selected link lists
        let tempLinkList:number[] = [];
        pageTypeLinkList.forEach((list)=>{
            if(list.isSelected){
                tempLinkList.push(list.pageId);
            }
        })

        // get selected image lists
        let tempImageList:number[] = [];
        pageTypeImageList.forEach((image)=>{
            if(image.isSelected){
                tempImageList.push(image.pageId);
            }
        })

        // get selected page and page-main-nav lists; to generate child list 
        let tempPageAndPageMainNavList:{childId:number, childOrder:number}[] = [];
        pageTypePageAndPageMainNavList.forEach((child)=>{
            if(child.isSelected){
                tempPageAndPageMainNavList.push({childId:child.pageId, childOrder:child.pageOrder?child.pageOrder:0});
            }
        })


        // call savePage from DashboardContext to save the page.
        const result = await savePage(pageName, pageAlias, description, imageFile.image!, imageFile.imageName, imageFile.imagePath, pageType, pageIdBeingEdited!, tempLinkList, tempImageList, tempPageAndPageMainNavList);
        
        // if data is saved, clear the create page form
        if(result){
            // target.pageTitle.value = '';
            setPageIdBeingEdited(null);
            setPageName('');
            setPageAlias('');
            setOriginalAliasBeforeEditing('');
            setPageType('');
            // setPageParent(0);
            updateDescription('');
            setImageFile({} as ImageFileStateType);
            setEditMode(false);
        }else{
            alert('Failed to create page. Please try again.');
        }
    }

    //updatePageTypePageAndPageMainNav
    /**
     * to set/unset isSelected flag of pageTypePageAndPageMainNavList data
     * @param ids :number[]; array of id of link clicked
     * @author Anil
     */
     const updatePageTypePageAndPageMainNav = (childLists:{childId:number,childOrder:number}[], pageId:number)=>{
        let tempPageTypePageAndPageMainNavList = pageTypePageAndPageMainNavList.map((list)=>{
            // if ids exists then alter the state of existing ids else reset to false
            if(childLists[0] && childLists?.length > 0){
                let matchedElement = childLists.find(({childId})=>{
                    return childId === list.pageId;
                });

                if(matchedElement){
                    return {...list, pageOrder:matchedElement.childOrder, isSelected:true, isActive: (list.pageId === pageId)?false:true}
                }else{
                    return {...list, pageOrder:0, isSelected:false, isActive: (list.pageId === pageId)?false:true}
                }
            }else{
                // resets all isSelected flag to false
                return {...list, pageOrder:0, isSelected:false, isActive: (list.pageId === pageId)?false:true}
            }
        });

        setPageTypePageAndPageMainNavList(tempPageTypePageAndPageMainNavList);
    }


     /**
     * to set/unset isSelected flag of pageTypeLinkList data
     * @param ids :number[]; array of id of link clicked
     * @author Anil
     */
    const updatePageTypeLinkList = (ids:number[])=>{
        let tempPageTypeLinkList = pageTypeLinkList.map((list)=>{
            // if ids exists then alter the state of existing ids else reset to false
            if(ids[0] !== 0){
                if(ids.includes(list.pageId)){
                    return {...list, isSelected:true, isActive:true}
                }else{
                    return {...list, isSelected:false, isActive:true}
                }
            }else{
                // resets all isSelected flag to false
                return {...list, isSelected:false, isActive:true}
            }
            
        });
        
       setPageTypeLinkList(tempPageTypeLinkList);
    }


      /**
     * to set/unset isSelected flag of pageTypeImageList data
     * @param ids :number[]; array of id of image clicked
     * @author Anil
     */
    const updatePageTypeImageList = (ids:number[])=>{
        let tempPageTypeImageList = pageTypeImageList.map((image)=>{
            // if ids exists then alter the state of existing ids else reset to false
            if(ids[0] !== 0){
                if(ids.includes(image.pageId)){
                    return {...image, isSelected:true}
                }else{
                    return {...image, isSelected:false}
                }
            }else{
                // resets all isSelected flag to false
                return {...image, isSelected:false}
            }
            
        });
        
       setPageTypeImageList(tempPageTypeImageList);
    }

    /**
     * to toggle the isSelected state of pageTypePageAndPageMainNavList as capsule
     * @param id :number ; pageId of selected pageTypeLink as a capsule
     * @author Anil
     */
     const toggleCapsuleSelectedStateOfChild = (id:number)=>{
        let tempPageTypePageAndPageMainNavList = pageTypePageAndPageMainNavList.map((list)=>{
            // if ids exists then alter the state of existing ids
            if(id === list.pageId){
                return {...list, isSelected:!list.isSelected}
            }else{
                return {...list}
            }
        });
        setPageTypePageAndPageMainNavList(tempPageTypePageAndPageMainNavList);
    }

    //setChildOrder
    /**
     * to toggle the isSelected state of pageTypePageAndPageMainNavList as capsule
     * @param id :number ; pageId of selected pageTypeLink as a capsule
     * @author Anil
     */
     const setChildOrder = (childId:number,childOrder:number)=>{
        // console.log(childOrder);
        let tempPageTypePageAndPageMainNavList = pageTypePageAndPageMainNavList.map((list)=>{
            // if ids exists then alter the state of existing ids
            if(list.pageId === childId){
                return {...list, pageOrder:childOrder}
            }else{
                return {...list}
            }
        });
        setPageTypePageAndPageMainNavList(tempPageTypePageAndPageMainNavList);
    }


    /**
     * to toggle the isSelected state of pageTypeLink as capsule
     * @param id :number ; pageId of selected pageTypeLink as a capsule
     * @author Anil
     */
    const toggleCapsuleSelectedState = (id:number)=>{
        let tempPageTypeLinkList = pageTypeLinkList.map((list)=>{
            // if ids exists then alter the state of existing ids
            if(id === list.pageId){
                return {...list, isSelected:!list.isSelected}
            }else{
                return {...list}
            }
        });
        setPageTypeLinkList(tempPageTypeLinkList);
    }

    /**
     * to toggle the isSelected state of pageTypeImage as thumbnail
     * @param id :number ; pageId of selected pageTypeImage as a thumbnail
     * @author Anil
     */
     const toggleImageThumbnailSelectedState = (id:number)=>{
        let tempPageTypeImageList = pageTypeImageList.map((image)=>{
            // if ids exists then alter the state of existing ids
            if(id === image.pageId){
                return {...image, isSelected:!image.isSelected}
            }else{
                return {...image}
            }
        });
        setPageTypeImageList(tempPageTypeImageList);
    }



    /**
     * to display the fields corresponding to the page values while clicking on each of the rows for editing
     * @param row 
     * @author Anil
     */
    const editPage = async (row:DataRowType)=>{
        // set the edit mode
        setEditMode(true);

        // set the page title to the form
        setPageIdBeingEdited(row.pageId);

        setPageName(row.pageName);
        
        setPageAlias(row.pageAlias);
        
        // store original alias before editing
        setOriginalAliasBeforeEditing(row.pageAlias);
        
        setPageType(row.pageType);
        
        // setPageParent(row.hasParentId);
        
        // set selected page or page-main-nav
        updatePageTypePageAndPageMainNav(row.pageChildList ? row.pageChildList:[], row.pageId);

        // set selected link
        updatePageTypeLinkList(row.pageLinkList ? row.pageLinkList:[0]);

        // set selected image
        updatePageTypeImageList(row.pageImageList ? row.pageImageList:[0]);
        
        setDescription(row.description);
        
        // clear any image possibly be selected
        setImageFile({} as ImageFileStateType);
        
        // set image properties of the page being edited
        if(row.imageName){
            // get page image url relative to the firebase storage
            const imageUrl = await getImageUrl(row.imageName);
            setImageFile({imageName:row.imageName,imagePath:imageUrl, justSelected:false});
        }
    }

    // const deletePageNRemoveParentId = async (row:DataRowType)=>{
    //     if(window.confirm('Do you want to delete the page?') === true){
    //         //console.log(row.pageId);
    //         // getPageByParentId(row.pageId);

    //         const childPages = pageWithParentName.filter((page)=>page.hasParentId === row.pageId);
    //         const isDeleted = await deletePage(row.pageId, row.imageName, childPages);
    //         if(isDeleted){
    //             setPageIdBeingEdited(null);
    //             setPageName('');
    //             updateDescription('');
    //             setPageAlias('');
    //             setOriginalAliasBeforeEditing('');
    //             setImageFile({} as ImageFileStateType);
    //             setEditMode(false);
    //             setPageType('');
    //             setPageParent(0);
    //             setErrorMessage({aliasNameError:''});
    //             setDisableCreatePageBtn(false);
    //             console.log('Page successfully deleted');
    //         }
    //         else
    //             console.error('Delete unsuccessfull');
            
    //     }
    //     else
    //         console.log('You decided to not to delete the page');

    // }

    const deletePageNRemoveParentId = async (row:DataRowType)=>{
        if(window.confirm('Do you want to delete the page?') === true){
            var tempPageWithSelectedAsChild:DataRowType[] = [];
            pageWithParentName.forEach((page)=>{
                //return page.pageChildList.include(row.pageId)
                let isChildPresent = page.pageChildList.find((child)=>{
                    return child.childId === row.pageId;
                });

                if(isChildPresent){
                    tempPageWithSelectedAsChild.push(page)
                }
                // return tempPageWithSelectedAsChild;
            });
            
            const isDeleted = await deletePage(row.pageId, row.imageName, tempPageWithSelectedAsChild);
            if(isDeleted){
                setPageIdBeingEdited(null);
                setPageName('');
                updateDescription('');
                setPageAlias('');
                setOriginalAliasBeforeEditing('');
                setImageFile({} as ImageFileStateType);
                setEditMode(false);
                setPageType('');
                // setPageParent(0);
                setErrorMessage({aliasNameError:''});
                setDisableCreatePageBtn(false);
                console.log('Page successfully deleted');
            }
            else
                console.error('Delete unsuccessfull');
            
        }
        else
            console.log('You decided to not to delete the page');

    }

    /**
     * to clear the field value and reset the edit mode on clicking the CANCEL button
     * @param e 
     * @author Anil
     */
    const clearFields = (e:React.MouseEvent<HTMLElement>)=>{
        e.preventDefault();
        setPageIdBeingEdited(null);
        setPageName('');
        updateDescription('');
        setPageAlias('');
        setOriginalAliasBeforeEditing('');
        setImageFile({} as ImageFileStateType);
        setEditMode(false);
        setPageType('');
        // setPageParent(0);
        setErrorMessage({aliasNameError:''});
        setDisableCreatePageBtn(false);
        // clear selected link list
        updatePageTypeLinkList([0]);

        // clear selected image list
        updatePageTypeImageList([0]);

        // clear selected sub childs list
        updatePageTypePageAndPageMainNav([], 0);
    }
   

    // To show list of created pages in Data Table
    const columns: TableColumn<DataRowType>[] = [
        {   
            name:'Delete',
            // cell:(row:DataRowType)=> <button data-tag="allowRowEvents" id={`'${row.pageId}'`}>Delete</button>
            cell:(row:DataRowType)=> <span id={`'${row.pageId}'`} onClick={()=>deletePageNRemoveParentId(row)} className="page-delete"> <MdDeleteForever/> </span>
        },
        {
            name:'Title',
            sortable:true,
            selector: row => row.pageName,
            grow:2
        },
        {
            name:'Alias',
            selector: row => row.pageAlias,
            grow:2
        },
        {
            name:'Page Type',
            sortable:true, // /\s+/g,'-'
            selector: row => ((row.pageType).replace(/-+/g,' ')),
            grow:2,
            style:{'textTransform':'capitalize'}
        }
        // ,
        // {
        //     name:'Parent Page',
        //     sortable:true,
        //     selector: row => row.hasParent,
        //     grow:2
        // }
    ];

    // Table custom css
    const customSyltes ={
        rows:{
            style:{
                height:'20px'
            }
        },
        headCells:{
            style:{
                fontSize:'12px'
            }
        },
        cells:{
            style:{
                fontSize:'12px'
            }
        }
    }

    // generate Parent page option list
    useEffect(()=>{
        // to hold link pageType
        var tempPageTypeLinkList:pageTypeLinkListType[] = [];

        // to hold image pageType
        var tempPageTypeImageList:pageTypeImageListType[] = [];

        // to hold page and page-main-nav pageType
        var tempPageTypePageAndPageMainNavList:pageTypePageAndPageMainNavListType[] = [];

        // getParentList(dashboardState.pages!);
        if(dashboardState.pages){
            // To show select parent dropdown.

            let options = dashboardState.pages.map((page)=>{
                // generate list of pageType link
                if(page.pageType === 'link'){
                    // console.log(page.id);
                    tempPageTypeLinkList.push({pageId:page.id, pageAlias:page.pageAlias, isSelected:false, isActive:true});
                }

                 // generate list of pageType image
                 if(page.pageType === 'image' && page.imageName !==''){
                    // console.log(page.id);
                    tempPageTypeImageList.push({pageId:page.id, pageAlias:page.pageAlias, imageName:page.imageName!, imageUrl:page.imageUrl!, isSelected:false});
                }

                // generate list of pageType page and page-main-nav
                if(page.pageType === 'page' || page.pageType === 'page-main-nav'){
                    // console.log(page.id);
                    tempPageTypePageAndPageMainNavList.push({pageId:page.id, pageAlias:page.pageAlias, pageOrder:0, isSelected:false, isActive:true});
                }

                // get child lists
                // var parent = '';
                
                return {pageId:page.id, pageName:page.title, pageAlias:page.pageAlias, description:page.description, imageName:page.imageName!, imageUrl:page.imageUrl!, pageType:page.pageType, pageLinkList:page.pageLinkList? page.pageLinkList:[0], pageImageList:page.pageImageList? page.pageImageList:[0], pageChildList:page.pageChildList?page.pageChildList:[]}
            });
            
            // create links lists for LINKS capsules
            //console.log(tempPageTypeLinkList);
            setPageTypeLinkList(tempPageTypeLinkList);

            // create image lists for Image thumbnails
            setPageTypeImageList(tempPageTypeImageList);

            // create page and page-main-nav list
            setPageTypePageAndPageMainNavList(tempPageTypePageAndPageMainNavList);

            // create page list with parent name
            setPageWithParentName(options);

        }else{
            setPageWithParentName([]);
            setPageTypeLinkList([]);
            setPageTypeImageList([]);
        }

        // runs after the useEffect finishes exicuting
        return ()=> setLoading(false);

    },[dashboardState.pages]);

    // to hide the parent page field when the page type is 'link'
    useEffect(()=>{

        if(pageType === 'link'){
            // selectParentRef!.current!.style.display = "none";
            linksContainerRef!.current!.style.display = "none";
            pageImageUploaderRef!.current!.style.display = "none";
            imageContainerRef!.current!.style.display = "flex";
            childContainerRef!.current!.style.display = "none";

        }else if(pageType === 'image'){
            // selectParentRef!.current!.style.display = "none";
            linksContainerRef!.current!.style.display = "none";
            pageImageUploaderRef!.current!.style.display = "flex";
            imageContainerRef!.current!.style.display = "none";
            childContainerRef!.current!.style.display = "none";

        }else if(pageType === 'page' || pageType === 'page-main-nav'){
            // selectParentRef!.current!.style.display = "flex";
            linksContainerRef!.current!.style.display = "flex";
            imageContainerRef!.current!.style.display = "flex";
            pageImageUploaderRef!.current!.style.display = "none";
            childContainerRef!.current!.style.display = "flex";

        }else {
            // selectParentRef!.current!.style.display = "none";
            linksContainerRef!.current!.style.display = "none";
            pageImageUploaderRef!.current!.style.display = "none";
            imageContainerRef!.current!.style.display = "none";
            childContainerRef!.current!.style.display = "none";

        }
    },[pageType])


    return (
        <FlexDiv flex="1 1 auto" width="100%" minHeight="100%" justifyContent="center" flexWrap="wrap" gap="40px" padding="50px 10px">
            <FlexDiv flex="0 1 600px" flexDirection="column" className="create-new-page" gap="20px">
                <FlexDiv flex="0 0 auto" flexDirection="column" gap="10px">
                    <h3>Welcome to Admin Panel. </h3>
                    <sub>Please fill-up all the required ( <span style={{color:'red'}}>*</span> ) section.</sub>
                </FlexDiv>

                <form className="create-new-page__form" onSubmit={createOrUpdatePage}>
                    <FlexDiv flex="1 1 auto" width="100%" maxWidth="600px" gap="20px" flexWrap="wrap">
                        <Input flex="1 1 auto" width="280px" alignSelf="flex-start" label="PAGE TITLE" type="text" name="pageTitle" labelFor="pageTitle" 
                            onChangeFnc={updatePageName} 
                            value={pageName} 
                            required={true}/>

                        <Input flex="1 1 auto" width="280px" alignSelf="flex-start" label="PAGE ALIAS" type="text" name="pageAlias" labelFor="pageAlias" 
                            value={pageAlias} 
                            onChangeFnc={makeAlias} 
                            required={true} 
                            errorMessage={createPageErrorMessage.aliasNameError}/>

                    </FlexDiv>

                    <FlexDiv  flex="1 1 auto" width="100%" maxWidth="600px" gap="20px" flexWrap="wrap">
                        {/* to select page type */}
                        <SelectGeneral flex="1 1 auto" width="280px" alignSelf="flex-start" label="PAGE TYPE" type="text" name="pageType" labelFor="pageType" 
                            optionsGeneral={[
                                {optValue:'page', optDisplay:'Page', optDisable:(isEditMode && (pageType === 'link' || pageType ==='image'))? true:false},
                                {optValue:'page-main-nav', optDisplay:'Page and main nav', optDisable:(isEditMode && (pageType === 'link' || pageType ==='image'))? true:false},
                                {optValue:'link', optDisplay:'Link', optDisable:(isEditMode && (pageType === 'page' || pageType ==='page-main-nav' || pageType ==='image'))? true:false},
                                {optValue:'image', optDisplay:'Image', optDisable:(isEditMode && (pageType === 'link' || pageType === 'page' || pageType ==='page-main-nav'))? true:false}
                            ]} 
                            value={pageType} 
                            onChangeFnc={updatePageType} 
                            className="parentPageSelect" 
                            defaultText="Select page type"
                            errorMessage={createPageErrorMessage.pageTypeError}
                            required={true}
                            />
                    </FlexDiv>

                    {/* create multiple select child section */}
                    <MultipleChildSelect ref={childContainerRef} flex="1 1 auto" width="600px" alignSelf="flex-start" label="CHILDS" 
                        name="pageChilds" 
                        labelFor="pageChilds" 
                        multiChildSelectSource={pageTypePageAndPageMainNavList} 
                        onCapsuleClickFnc={toggleCapsuleSelectedStateOfChild}
                        onOrderChangedFnc={setChildOrder}
                    />

                    {/* create multiple select link section */}
                    <MultipleSelect ref={linksContainerRef} flex="1 1 auto" width="600px" alignSelf="flex-start" label="LINKS" 
                        name="pageLinks" 
                        labelFor="pageLinks" 
                        multiSelectSource={pageTypeLinkList} 
                        onCapsuleClickFnc={toggleCapsuleSelectedState}
                    />

                    {/* create multiple select image section */}
                    <ImageMultipleSelect ref={imageContainerRef} flex="1 1 auto" width="600px" alignSelf="flex-start" label="IMAGE" 
                        name="pageImages" 
                        labelFor="pageImages" 
                        imageMultiSelectSource={pageTypeImageList} 
                        onThumbnailClickFnc={toggleImageThumbnailSelectedState}
                    />

                    <UploadImage ref={pageImageUploaderRef} maxWidth="600px" alignSelf="flex-start" label="PAGE IMAGE" name="pageImage" title="Select an image at a time." labelFor="pageImage" imageData={imageFile}
                        onChangeFnc={(e)=>selectImage(e.target.files!)} 
                        onClickFnc={(e)=>onDeleteImageBtnClick(e)}
                    />

                    {/* <UploadImage maxWidth="600px" alignSelf="flex-start" label="PAGE IMAGE" name="pageImage" title="Select an image at a time." labelFor="pageImage" 
                        onChangeFnc={(e)=>selectImage(e.target.files!)}
                    /> */}

                    <FlexDiv flex="1 1 auto" maxWidth="600px" width="100%" alignSelf="flex-start" flexDirection="column" className="input-wrapper">

                        <label htmlFor="description">
                            <span>PAGE DESCRIPTION</span>
                            {createPageErrorMessage.descriptionError? <span className="error-message">{createPageErrorMessage.descriptionError}</span>:''}
                        </label>
                        <ReactQuill id="description" theme="snow" style={{width:"100%"}} value={description} onChange={updateDescription}/>
                        
                    </FlexDiv>
                    
                    {!isEditMode && <Button typeVariant="contained" typeColor="primary" maxWidth="599px" disabled={disableCreatePageBtn}> CREATE PAGE</Button>}
                   
                    {isEditMode && <FlexDiv flex="1 1 auto" maxWidth="600px" width="100%" alignSelf="flex-start" gap="20px">
                        <Button typeVariant="contained" typeColor="primary" maxWidth="599px"  disabled={disableCreatePageBtn}> UPDATE PAGE</Button>
                        <Button typeVariant="outlined" typeColor="primary" maxWidth="599px" onClickFnc={clearFields}> CANCEL</Button>
                    </FlexDiv>}
                    
                </form>
            </FlexDiv>
            <FlexDiv flex="1 1 auto" width="100%" maxWidth="600px" flexDirection="column">
                <div className="created-pages">
                    <DataTable 
                        columns={columns}
                        data={pageWithParentName} 
                        progressPending={loading}
                        title="Pages (click to edit)."
                        responsive
                        pagination 
                        striped
                        highlightOnHover
                        pointerOnHover
                        dense
                        paginationComponentOptions={{
                            rowsPerPageText: 'Data per page'
                        }}
                        onRowClicked={editPage}
                        customStyles={customSyltes}
                        // onRowClicked={(row,event)=>editPage(row,event)}
                    />
                </div>
            </FlexDiv>
        </FlexDiv>
    )
}