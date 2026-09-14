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

## task 1 - 실제 비율 적용 

**JSON**
```
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
          "type": "Ry",
          "args": [
            "5"
          ]
        },
        {
          "type": "Rz",
          "args": [
            "1.02*t"
          ]
        },
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
        },
        {
          "type": "Rz",
          "args": [
            "180"
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
          "type": "Rz",
          "args": [
            "90"
          ]
        }
      ]
    }
  ]
}
```

**설명**
```
실제 사이즈와 공전속도를 기반으로 1:1 스케일로 구현한 지구 - 허블우주망원경 - 달 입니다.
달과 지구 사이의 거리가 다른 물체들의 크기에 비해 압도적으로 거대해서 인공위성은 보이지 않으며, 달은 시뮬레이션이 이루어 지는 시간동안 매우 낮은 각속도로 회전하여 총 회전량이 공전궤도의 1/8에도 미치지 못하는 모습을 관측할 수 있었습니다.

실제와 유사한 환경을 세팅하기 위해 아래의 변수를 세팅했습니다.

허블 우주망원경: 크기 13m / 실제 촬영사진과 원본 각도가 유사해 각도는 유지
위성의 공전 궤도 반지름(지구중심으로부터) 6849 km
궤도 경사각 28.47도(북미-남아프리카공화국 라인을 따라 움직이는 것을 확인)
공전속도 초속 7.64km

지구 반지름 6371km

달과 지구 간의 거리 385000km
달의 반지름 1737km
달의 공전속도 초속 1.022km
달의 공전궤도 경사각 약 5도

Task1의 구현을 통해 실제 물리적 규모를 그대로 적용할 경우, 인간의 시각적 관찰 범위와 일반적인 시뮬레이션 시간만으로는 천체 간 거리와 공전 운동을 직관적으로 표현하기 어렵다는 점을 확인하였습니다.

또한 과제 설명에 언급된 대로, 깃허브.io로 배포할 경우 기본 줌 인 수치 차이로 인해 지구만 매우 거대하게 보인다는 것을 확인했습니다.

3가지 질문과 답변
거리의 단위를 무엇으로 정했는가? 왜 그렇게 정했는가?
 - km 단위로 정함. 가장 일반적이고 직관적인 단위이기에.
숫자가 커서 생긴 문제가 있었는가? 있었다면 무엇인가?
 - 거리 가늠이 직관적이지 않고, 배포버전에서 출력이 제대로 되지 않음.
달·위성이 지구를 향하게 만든 것은 어느 변환 단계 덕분인가?
 - 가장 오른편에 추가한 z축 회전. 달은 180도 회전시켜 화살표가 항상 지구를 향하고, 인공위성은(우주망원경이므로) 90도 회전시켜 지구의 반대쪽을 관측하는 모습을 묘사함. 즉, 원통의 반대편은 항상 지구를 향하는 셈.
```

**URL**
https://cg.catholic.ac.kr/~mgchoi/CG/demos/d02-transform-lab.html?d=eyJyYW5nZSI6eyJ4IjoiNDIwMDAwIiwieSI6IjQyMDAwMCIsInoiOiI0MjAwMDAifSwib2JqZWN0cyI6W3siaWQiOiJlYXJ0aCIsIm5hbWUiOiLsp4DqtawiLCJjb2xvciI6WzAuMzUsMC42LDAuOTVdLCJzdGVwcyI6W3sidHlwZSI6IlN1IiwiYXJncyI6WyI2MzcxIl19XX0seyJpZCI6Im1vb24iLCJuYW1lIjoi64usIiwiY29sb3IiOlswLjc4LDAuNzgsMC44Ml0sInN0ZXBzIjpbeyJ0eXBlIjoiUnkiLCJhcmdzIjpbIjUiXX0seyJ0eXBlIjoiUnoiLCJhcmdzIjpbIjEuMDIqdCJdfSx7InR5cGUiOiJUIiwiYXJncyI6WyIzODUwMDAiLCIwIiwiMCJdfSx7InR5cGUiOiJTdSIsImFyZ3MiOlsiMTczNyJdfSx7InR5cGUiOiJSeiIsImFyZ3MiOlsiMTgwIl19XX0seyJpZCI6InNhdCIsIm5hbWUiOiLsnbjqs7XsnITshLEiLCJjb2xvciI6WzAuOTUsMC43MiwwLjM1XSwic3RlcHMiOlt7InR5cGUiOiJSeSIsImFyZ3MiOlsiMjguNDciXX0seyJ0eXBlIjoiUnoiLCJhcmdzIjpbInQqNy42NCJdfSx7InR5cGUiOiJUIiwiYXJncyI6WyI2ODQ5IiwiMCIsIjAiXX0seyJ0eXBlIjoiU3UiLCJhcmdzIjpbIjAuMDEzIl19LHsidHlwZSI6IlJ6IiwiYXJncyI6WyI5MCJdfV19XX0%3D


**IMAGE**
![Task 1 — 실제 비율로 배치한 지구와 인공위성](images/task1.png)

- [Task 1 실행하기](https://syzygykr.github.io/cg-2026-solar-syzygykr/week2/task1.html)


## task 2 - NDC 범위에 맞춰 배치

**JSON**
```
{
  "range": {
    "x": "1",
    "y": "1",
    "z": "1"
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
            "1/386737"
          ]
        },
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
          "type": "Su",
          "args": [
            "1/386737"
          ]
        },
        {
          "type": "Ry",
          "args": [
            "5"
          ]
        },
        {
          "type": "Rz",
          "args": [
            "1.02*t"
          ]
        },
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
        },
        {
          "type": "Rz",
          "args": [
            "180"
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
          "type": "Su",
          "args": [
            "1/386737"
          ]
        },
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
          "type": "Rz",
          "args": [
            "90"
          ]
        }
      ]
    }
  ]
}
```



**설명**
```
task1의 결과물에 오직 배율만을 적용합니다.

우리는 지구~달을 -1~1 거리에 두고 싶습니다.

이 말은, (지구-달 거리 + 달 반지름) 이 식이 총 1 만큼의 거리를 가지게끔 정규화를 해야 한다는 것이고

그 말은 동시에 1/386737 배율을 적용해야 한다는 것입니다.

s = 1/386737 = 0.000002585 입니다.
제발 언더플로우가 발생하지 않기를 기도하며 배율을 적용해보겠습니다.
또한 모든 축에 대해서 동일비율로 배율을 적용해야 하니 그냥 크기(균등)으로 처리해도 됩니다.

결과는 성공적입니다.

task1과 완벽하게 동일한 구도가 범위만 축소되어 재현되었습니다.
(일부 각도에서 달이 평면 바깥에 있는 것 처럼 보이는 것은 달의 공전 궤도가 해당 평면과 5도 틀어져 있기 때문입니다.)


```

**URL**
https://cg.catholic.ac.kr/~mgchoi/CG/demos/d02-transform-lab.html?d=eyJyYW5nZSI6eyJ4IjoiMSIsInkiOiIxIiwieiI6IjEifSwib2JqZWN0cyI6W3siaWQiOiJlYXJ0aCIsIm5hbWUiOiLsp4DqtawiLCJjb2xvciI6WzAuMzUsMC42LDAuOTVdLCJzdGVwcyI6W3sidHlwZSI6IlN1IiwiYXJncyI6WyIxLzM4NjczNyJdfSx7InR5cGUiOiJTdSIsImFyZ3MiOlsiNjM3MSJdfV19LHsiaWQiOiJtb29uIiwibmFtZSI6IuuLrCIsImNvbG9yIjpbMC43OCwwLjc4LDAuODJdLCJzdGVwcyI6W3sidHlwZSI6IlN1IiwiYXJncyI6WyIxLzM4NjczNyJdfSx7InR5cGUiOiJSeSIsImFyZ3MiOlsiNSJdfSx7InR5cGUiOiJSeiIsImFyZ3MiOlsiMS4wMip0Il19LHsidHlwZSI6IlQiLCJhcmdzIjpbIjM4NTAwMCIsIjAiLCIwIl19LHsidHlwZSI6IlN1IiwiYXJncyI6WyIxNzM3Il19LHsidHlwZSI6IlJ6IiwiYXJncyI6WyIxODAiXX1dfSx7ImlkIjoic2F0IiwibmFtZSI6IuyduOqzteychOyEsSIsImNvbG9yIjpbMC45NSwwLjcyLDAuMzVdLCJzdGVwcyI6W3sidHlwZSI6IlN1IiwiYXJncyI6WyIxLzM4NjczNyJdfSx7InR5cGUiOiJSeSIsImFyZ3MiOlsiMjguNDciXX0seyJ0eXBlIjoiUnoiLCJhcmdzIjpbInQqNy42NCJdfSx7InR5cGUiOiJUIiwiYXJncyI6WyI2ODQ5IiwiMCIsIjAiXX0seyJ0eXBlIjoiU3UiLCJhcmdzIjpbIjAuMDEzIl19LHsidHlwZSI6IlJ6IiwiYXJncyI6WyI5MCJdfV19XX0%3D

**IMAGE**
![Task 2 —  NDC 범위에 맞춰 배치한 지구와 인공위성](images/task2.png)

- [Task 2 실행하기](https://syzygykr.github.io/cg-2026-solar-syzygykr/week2/task2.html)


## task 3 - 보는 사람을 위해 조절

**JSON**
```

```

**설명**
```

```

**URL**

**IMAGE**
![Task 3 — 보는 사람을 위해 조절한 지구와 인공위성](images/task3.png)

- [Task 3 실행하기](https://syzygykr.github.io/cg-2026-solar-syzygykr/week2/task3.html)

