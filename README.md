<div align="center" >

# 🌟 PRV(Paper Reference Visualization)

**Paper Reference Visualization**

논문 검색 & 레퍼런스 시각화 사이트

![Javascript](https://img.shields.io/badge/javascript-ES6+-yellow?logo=javascript)
![NodeJS](https://img.shields.io/badge/node.js-v18-green?logo=node.js)
![데모](https://user-images.githubusercontent.com/25934842/207359316-f7056911-d26a-4671-bc3c-2a80e46f24b8.gif)

</div>

### 팀원

<table>
  <th>J053</th>
  <th>J073</th>
  <th>J143</th>
  <th>J205</th>
  <tr>
    <td><img src="https://avatars.githubusercontent.com/u/53340295?v=4" width="180" height="180"/></td>
    <td><img src="https://avatars.githubusercontent.com/u/50133823?v=4" width="180" height="180"/></td>
    <td><img src="https://avatars.githubusercontent.com/u/25934842?v=4" width="180" height="180"/></td>
    <td><img src="https://avatars.githubusercontent.com/u/30085476?v=4" width="180" height="180"/></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/JunYupK">김준엽</a>
    </td>
    <td align="center"><a href="https://github.com/Palwol">박미림</a>
    </td>
    <td align="center"><a href="https://github.com/leesungbin">이성빈</a>
    </td>
    <td align="center"><a href="https://github.com/yeynii">최예윤</a>
  </tr>
  <tr>
</table>

### 개발 환경 세팅

#### Front-end

```bash
cd frontend
npm install
npm start
```

#### Back-end

```bash
cd backend
npm install
npm start
# 환경변수 주입 필요(예: npm run start:mac)
```

### 환경변수

#### Front-end

```
REACT_APP_BASE_URL=
```

#### Back-end

```
PORT=
REDIS_POPULAR_KEY=
REDIS_PREVRANKING=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
ELASTIC_INDEX=
ELASTIC_HOST=
ELASTIC_USER=
ELASTIC_PASSWORD=
ALLOW_UPDATE=
MAIL_TO=
```

## 기술스택

![tech stack](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/dc2980d2-2539-4ab8-918f-0a0536f73e70/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221208T145054Z&X-Amz-Expires=86400&X-Amz-Signature=087c5926c151a00d818b63907e0c60e0c0add11db4da51117c287b2a51976d1d&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject)

## 데이터 수집 정책

- PRV 서비스에서 사용되는 모든 논문 정보는 Crossref API를 통해 수집됩니다.
- 사용자로부터 수집되는 정보는 다음과 같습니다.
  - 검색 키워드
- 수집되는 정보는 다음과 같은 목적으로 이용합니다.
  - 인기 검색어 서비스 제공
  - 키워드 자동완성 검색 서비스 제공
  - 키워드 검색 서비스 제공
  - 논문 DOI를 통한 인용관계 시각화 서비스 제공
- 사용자는 키워드 검색시 PRV 데이터베이스에 있는 정보만 조회할 수 있으며, 데이터베이스에 없는 논문에 대한 데이터 수집은 Request batch에 의해 처리되므로 검색 결과를 즉시 받아보지 못할 수 있습니다.
- Request batch에 의해 수집된 결과는 데이터베이스에 저장됩니다.
- 추가 문의사항은 viewpoint.prv@gmail.com 로 연락바랍니다.

### [Crossref](https://www.crossref.org/) API

- Crossref : Official digital object identifier Registration Agency of the International DOI Foundation.
- 22.12.08. 기준 140,229,346개의 논문 메타데이터를 보유 중
- License - Creative Commons Attribution 4.0 International (CC BY 4.0)
  <p align="center"><img src="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/af1b24dd-64a9-40ed-8df2-74e892d8facb/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20221208%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20221208T145000Z&X-Amz-Expires=86400&X-Amz-Signature=880cd6deabf4352b27bcd08ed36576d882b0b312218184bee5ff207cd64f3c90&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22Untitled.png%22&x-id=GetObject" width=100></img><p>
