<div align="center" >

# 🌟 PRV(Paper Reference Visualization)

**Paper Reference Visualization**

논문 검색 & 레퍼런스 시각화 사이트

![Javascript](https://img.shields.io/badge/javascript-ES6+-yellow?logo=javascript)
![NodeJS](https://img.shields.io/badge/node.js-v18-green?logo=node.js)
![데모](https://user-images.githubusercontent.com/25934842/207359316-f7056911-d26a-4671-bc3c-2a80e46f24b8.gif)

</div>

### 기능 목록

#### 인기 검색어

![1](https://user-images.githubusercontent.com/25934842/207813681-bade76c7-49f5-47dc-a712-4cb9dfb87cd9.gif)

- 검색량이 많은 검색어를 1~10위까지 보여줍니다.
- 검색어를 클릭하면 해당 키워드로 검색된 리스트 페이지로 이동합니다.

#### 논문 검색

![2](https://user-images.githubusercontent.com/25934842/207813670-5dc3ed09-8d44-44ef-853e-20362fab92d1.gif)

- 검색창에 포커스하면 최근 검색어 목록을 5개까지 보여줍니다.
- 키워드를 2자이상 입력하면 자동완성 검색어 목록을 보여줍니다.
- 저자, 제목, 키워드를 입력하여 검색버튼을 누르면 검색 리스트로 이동합니다.
- DOI로 검색하면 바로 해당 논문의 시각화 페이지로 이동합니다.
- 최근 검색어 목록이나 자동완성 검색어는 mouse-over, 방향키 이벤트로 커서를 이동시킬 수 있습니다.

#### 논문 리스트

![3](https://user-images.githubusercontent.com/25934842/207813649-d23bc237-71da-48d7-98f1-6cf10b6139da.gif)

- 키워드와 유사성이 높은 논문 목록을 보여줍니다.
- 리스트는 20개 단위로 페이지네이션 됩니다.

#### 논문 시각화 페이지

![4](https://user-images.githubusercontent.com/25934842/207815534-0b2cc38b-88cb-4ff6-af14-6ff48b50dee8.gif)

- 좌측에서는 선택한 논문의 정보(제목, 저자, DOI, 인용논문 목록)을 보여줍니다.
  - 인용 논문 목록에 포함된 논문제목을 hovering하면 오른쪽 그래프에서 해당하는 논문node를 강조합니다.
- 우측에서는 선택한 논문의 데이터로 시각화된 네트워크 차트를 보여줍니다.
  - 논문은 node, 논문간 인용관계는 line으로 표현됩니다.
  - 주위 node를 클릭하면 해당 논문node의 인용관계가 추가로 시각화 됩니다.
  - node에 호버링하면 해당 논문과 해당 논문이 인용한 논문들의 nodes, lines가 강조됩니다.
  - 마우스 드래그로 그래프 위치를 옮길 수 있습니다.
  - 스크롤로 그래프를 zoom-in, zoom-out 할 수 있습니다.

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
</table>

### 개발 환경 세팅

> 환경변수는 `/frontend`, `/backend` 폴더에 있는 `.env.sample` 파일을 참고해주시기 바랍니다.

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
```

## 기술스택
![techstack](https://user-images.githubusercontent.com/25934842/283773241-2f8a6c59-0f52-4425-9f29-c6b9ac8bb9ab.png)

## 데이터 수집 정책

- PRV 서비스에서 사용되는 모든 논문 정보는 Crossref API를 통해 수집됩니다.
- 사용자로부터 수집되는 정보는 다음과 같습니다.
  - 검색 키워드
- 수집되는 정보는 다음과 같은 목적으로 이용합니다.
  - 인기 검색어 서비스 제공
  - 키워드 자동완성 검색 서비스 제공
  - 키워드 검색 서비스 제공
  - 논문 DOI를 통한 인용관계 시각화 서비스 제공
- 사용자는 키워드 검색시 PRV 데이터베이스에 있는 정보 혹은 Crossref API를 통해 요청한 정보를 조회할 수 있으며, 데이터베이스에 없는 논문에 대한 데이터 수집은 Request batch에 의해 처리되므로 검색 결과를 즉시 받아보지 못할 수 있습니다.
- Request batch에 의해 수집된 결과는 데이터베이스에 저장됩니다.
- 추가 문의사항은 viewpoint.prv@gmail.com 로 연락바랍니다.

### [Crossref](https://www.crossref.org/) API

- Crossref : Official digital object identifier Registration Agency of the International DOI Foundation.
- 22.12.08. 기준 140,229,346개의 논문 메타데이터를 보유 중
- License - Creative Commons Attribution 4.0 International (CC BY 4.0)
  <p align="center">
  <img src="https://user-images.githubusercontent.com/30085476/223893006-95a362a2-7e17-4826-aa6e-ecd561e47584.png" width=100></img
  <p>
