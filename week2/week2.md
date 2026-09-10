# 2주차 보고서

이름은 **김도현**, 저장소는 `cg-2026-solar-syzygykr` 입니다.

## 조사한 값

대상 인공위성: **허블 우주 망원경**

| 항목 | 값 | 출처 |
| --- | --- | --- |
| 위성의 궤도 반지름 |  6849 km | satellitemap.space |
| 위성의 고도 |  478.2 km | satellitemap.space |
| 위성의 크기 | 길이 13m, 렌즈 구경 2.4m | 나무위키 |
| 위성의 궤도경사각 | 28.47도 | satellitemap.space |
| 위성의 공전속도 | 7.64km/s | satellitemap.space |
| 지구 반지름 | 6371 km | 나무위키 |
| 달까지 거리 | 385000 km | 나무위키 |
| 달의 반지름 | 1737 km | 나무위키 |


## 내가 넣은 변환

### task 1

**JSON**
{
  "range": {
    "x": "420000",
    "y": "420000",
    "z": "420000"
  },
  "objects": [
    {
      "id": "earth",
      "name": "지구",
      "color": [
        0.35,
        0.6,
        0.95
      ],
      "steps": [
        {
          "type": "Su",
          "args": [
            "6371"
          ]
        }
      ]
    },
    {
      "id": "moon",
      "name": "달",
      "color": [
        0.78,
        0.78,
        0.82
      ],
      "steps": [
        {
          "type": "T",
          "args": [
            "385000",
            "0",
            "0"
          ]
        },
        {
          "type": "Su",
          "args": [
            "1737"
          ]
        }
      ]
    },
    {
      "id": "sat",
      "name": "인공위성",
      "color": [
        0.95,
        0.72,
        0.35
      ],
      "steps": [
        {
          "type": "Ry",
          "args": [
            "28.47"
          ]
        },
        {
          "type": "Rz",
          "args": [
            "t*7.64"
          ]
        },
        {
          "type": "T",
          "args": [
            "6849",
            "0",
            "0"
          ]
        },
        {
          "type": "Su",
          "args": [
            "0.013"
          ]
        },
        {
          "type": "Rx",
          "args": [
            "0"
          ]
        }
      ]
    }
  ]
}


**설명**

**URL**
https://cg.catholic.ac.kr/~mgchoi/CG/demos/d02-transform-lab.html?d=eyJyYW5nZSI6eyJ4IjoiNDIwMDAwIiwieSI6IjQyMDAwMCIsInoiOiI0MjAwMDAifSwib2JqZWN0cyI6W3siaWQiOiJlYXJ0aCIsIm5hbWUiOiLsp4DqtawiLCJjb2xvciI6WzAuMzUsMC42LDAuOTVdLCJzdGVwcyI6W3sidHlwZSI6IlN1IiwiYXJncyI6WyI2MzcxIl19XX0seyJpZCI6Im1vb24iLCJuYW1lIjoi64usIiwiY29sb3IiOlswLjc4LDAuNzgsMC44Ml0sInN0ZXBzIjpbeyJ0eXBlIjoiVCIsImFyZ3MiOlsiMzg1MDAwIiwiMCIsIjAiXX0seyJ0eXBlIjoiU3UiLCJhcmdzIjpbIjE3MzciXX1dfSx7ImlkIjoic2F0IiwibmFtZSI6IuyduOqzteychOyEsSIsImNvbG9yIjpbMC45NSwwLjcyLDAuMzVdLCJzdGVwcyI6W3sidHlwZSI6IlJ5IiwiYXJncyI6WyIyOC40NyJdfSx7InR5cGUiOiJSeiIsImFyZ3MiOlsidCo3LjY0Il19LHsidHlwZSI6IlQiLCJhcmdzIjpbIjY4NDkiLCIwIiwiMCJdfSx7InR5cGUiOiJTdSIsImFyZ3MiOlsiMC4wMTMiXX0seyJ0eXBlIjoiUngiLCJhcmdzIjpbIjAiXX1dfV19

**IMAGE**
![Task 1 — 실제 비율로 배치한 지구와 인공위성](images/task1.png)

- [Task 1 실행하기](https://<username>.github.io/cg-2026-solar/week2/task1.html)


### task 2

**JSON**



**설명**

**URL**

**IMAGE**
![Task 2 —  NDC 범위에 맞춰 배치한 지구와 인공위성](images/task1.png)

- [Task 2 실행하기](https://<username>.github.io/cg-2026-solar/week2/task1.html)


### task 3

**JSON**

**설명**

**URL**

**IMAGE**
![Task 3 — 보는 사람을 위해 조절한 지구와 인공위성](images/task1.png)

- [Task 3 실행하기](https://<username>.github.io/cg-2026-solar/week2/task1.html)

