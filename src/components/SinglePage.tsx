import React from 'react';
import { FrontEndContext } from '../context/FrontEndContext';
import { FlexDiv } from '../styles/globalStyleComponent';

export const SinglePage = ()=>{
    
    const {frontEndState} = React.useContext(FrontEndContext);

    return(
        <>
            {frontEndState.currentPage?.normalDetail?<FlexDiv flex="1 1 auto" flexDirection="column" alignContent="start" className="page__wrapper"> 
                {frontEndState.currentPage?.imageDetail![0]?.imageUrl? <FlexDiv flex="0 1 400px" width="100%" className="page__background-image after-content-space">
                    <img src={frontEndState.currentPage?.imageDetail![0]?.imageUrl} alt={frontEndState.currentPage?.imageDetail![0]?.title}/>
                </FlexDiv>:<FlexDiv flex="0 0 0" className="after-content-space"></FlexDiv>}

                <FlexDiv flex="0 1 40px" width="100%" className="container page-title">{frontEndState.currentPage?.normalDetail?.title}</FlexDiv>

                <FlexDiv flex="0 1 auto" className="container page__description after-content-space" width="100%">
                    {frontEndState.currentPage?.normalDetail?.description ? <div><pre dangerouslySetInnerHTML={{ __html:`${frontEndState.currentPage?.normalDetail?.description!}`}}></pre></div>:''}
                </FlexDiv>
            </FlexDiv>:<FlexDiv flex="1 1 auto" height="100%" justifyContent="center" alignItems="center"> <h2>Invalid link !!</h2></FlexDiv>}
        </>
    )
}


// import React, { useEffect } from 'react';
// import { FrontEndContext } from '../context/FrontEndContext';
// import { FlexDiv } from '../styles/globalStyleComponent';
// import { PageWithImageDataType } from '../context/FrontEndContext'

// export const SinglePage = ()=>{
    
//     const {frontEndState} = React.useContext(FrontEndContext);
//     const [currentPage, setCurrentPage] = React.useState(null as unknown as PageWithImageDataType)

//     useEffect(()=>{
//         if(frontEndState.currentPage)
//             setCurrentPage(frontEndState.currentPage);

//     },[frontEndState]);

//     return(
//         <FlexDiv flex="1 1 auto" flexDirection="column" alignContent="start" className="page__wrapper"> 

//             {/* To render the main page image and description */}

//             {currentPage?.imageDetail![0]?.imageUrl? <FlexDiv flex="0 1 400px" width="100%" className="page__background-image after-content-space">
//                 <img src={currentPage?.imageDetail![0]?.imageUrl} alt={currentPage?.imageDetail![0]?.title}/>
//             </FlexDiv>:<FlexDiv flex="0 0 0" className="after-content-space"></FlexDiv>}

//             <FlexDiv flex="0 1 40px" width="100%" className="container page-title">{currentPage?.normalDetail?.title}</FlexDiv>

//             <FlexDiv flex="0 1 auto" className="container page__description after-content-space">
//                 {currentPage?.normalDetail?.description ? <div dangerouslySetInnerHTML={{ __html:`${currentPage?.normalDetail?.description!}`}}></div>:''}
//             </FlexDiv>
//         </FlexDiv>
//     )
// }