# NOTES:

This project uses Firebase as BAS (Backend as Service), and requires to have Realtime Database (to store all the page information), Storage (to store all the images), and Firebase Authentication (to track user login/logout).

This project requires following credential set up:

## Firebase:

Please update your credentials while creating the firebase project into the firebase.js file.

## EmailJs:

Please update your email js credentials into the components/ContactPage.tsx component page.

## Recaptcha:

Please update your recaptcha credentials into the components/ContactPage.tsx component page.


# Firebase Realtime-database structure:

Following is the database structure of the backend

```json
    
    
    {
  "pages": {
    "1668252234322": {
      "description": "",
      "id": 1668252234322,
      "imageName": "",
      "imageUrl": "",
      "pageAlias": "about-us-3",
      "pageChildList": [
        {
          "childId": 1668252256998,
          "childOrder": 0
        }
      ],
      "pageImageList": [
        1669633735992,
        1669633821192
      ],
      "pageLinkList": [
        1669866437453
      ],
      "pageType": "page-main-nav",
      "title": "About us"
    },
    "1668252256998": {
      "description": "",
      "id": 1668252256998,
      "imageName": "",
      "imageUrl": "",
      "pageAlias": "home-1",
      "pageChildList": [
        {
          "childId": 1668252234322,
          "childOrder": 1
        },
        {
          "childId": 1668252305239,
          "childOrder": 2
        }
      ],
      "pageImageList": [
        1668428330524,
        1669633735992,
        1669633821192,
        1669637685197
      ],
      "pageLinkList": [
        0
      ],
      "pageType": "page-main-nav",
      "title": "Home"
    },
    "1668252305239": {
      "description": "",
      "id": 1668252305239,
      "imageName": "",
      "imageUrl": "",
      "pageAlias": "our-services-3",
      "pageImageList": [
        1668563987743
      ],
      "pageLinkList": [
        0
      ],
      "pageType": "page-main-nav",
      "title": "Our Services"
    },
    "1668252330423": {
      "description": "",
      "id": 1668252330423,
      "imageName": "",
      "imageUrl": "",
      "pageAlias": "contact-us",
      "pageChildList": [
        {
          "childId": 1671456402819,
          "childOrder": 1
        }
      ],
      "pageImageList": [
        1668252419627
      ],
      "pageLinkList": [
        0
      ],
      "pageType": "page-main-nav",
      "title": "Contact Us"
    },
    "1668252419627": {
      "description": "<p>logo</p>",
      "id": 1668252419627,
      "imageName": "logo.jpg",
      "imageUrl": "https://firebasestorage.googleapis.com/v0/b/o/images%20logo.jpg?alt=media&token=4131c60-4994-acc8",
      "pageAlias": "logo",
      "pageImageList": [
        0
      ],
      "pageLinkList": [
        0
      ],
      "pageParent": 0,
      "pageType": "image",
      "title": "logo"
    }
  }
}
    
    
```

# FrontEnd:

All the data required for the front-end will be handled by FrontEndContext.tsx file inside the context directory. The structure of the front-end states is as below;

```json
{
  "frontEndState": {
    "headerMenu": [
      "{id: 1668252256998, pageAlias: \"home-1\", pageChildL…}",
      "{id: 1669865476235, pageAlias: \"events-2\", pageChil…}",
      "{id: 1668252234322, pageAlias: \"about-us-3\", pageCh…}",
      "{id: 1668252305239, pageAlias: \"our-services-3\", pa…}",
      "{id: 1668252330423, pageAlias: \"contact-us\", pageCh…}"
    ],
    "logo": {
      "id": 1668252419627,
      "title": "logo",
      "pageAlias": "logo",
      "imageName": "logo.jpg",
      "imageUrl": "https://firebasestorage.googleapis.com/v0/b/o/images%20logo.jpg?alt=media&token=4131c60-4994-acc8"
    },
    "pagePath": "home-1",
    "currentPage": {
      "normalDetail": "{description: \"<p class=\"ql-align-justify\"><strong>…}",
      "imageDetail": "[{…}, {…}, {…}, {…}]"
    },
    "childPage": [
      "{imageDetail: Array(2), normalDetail: {…}, pageOrde…}",
      "{imageDetail: Array(1), normalDetail: {…}, pageOrde…}",
      "{imageDetail: Array(1), normalDetail: {…}, pageOrde…}"
    ],
    "copyRight": {
      "description": "<p>Copy rights: © 2022 ABC Company</p><p><a href=\"policy\" rel=\"noopener noreferrer\" target=\"_blank\">Privacy Policy</a></p>",
      "id": 1671328791758,
      "imageName": "",
      "imageUrl": "",
      "pageAlias": "copy-rights",
      "pageImageList": "[0]",
      "pageLinkList": "[0]",
      "pageType": "page",
      "title": "Copy Rights"
    },
    "footerContact": {
      "description": "<p>ABC Address</p><p>0451866980</p><p><a href=\"mailto:info@abc.com\" rel=\"noopener noreferrer\" target=\"_blank\">info@abc.com</a></p>",
      "id": 1669867089747,
      "imageName": "",
      "imageUrl": "",
      "pageAlias": "footer-contact",
      "pageImageList": "[0]",
      "pageLinkList": "[0]",
      "pageType": "page",
      "title": "Footer Contact us"
    },
    "footerSocialLinks": [
      "{description: \"<p>https://www.facebook.com/}",
      "{description: \"<p>https://www.instagram.com/}"
    ]
  },
  "getHeaderMenu": "ƒ getHeaderMenu() {}",
  "getPageByAttributeAndValue": "ƒ getPageByAttributeAndValue() {}",
  "getPageDetails": "ƒ getPageDetails() {}"
}

```




# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
