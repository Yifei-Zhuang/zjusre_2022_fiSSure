<font color="red" size="10em">注意下面所有的begin和tail属性中，如果月份或者日期不足2位，要在前面补上一个0，不然utc时间parse的时候会出问题，比如2022-12-1要变成2022-12-01</font>



###### 暂时没找到router.group的方法，所以url可能有点乱

## 1.commit

### 1.1 GetCommitInfo

>获取给定的仓库的commit信息并存储
>
>method: POST
>
>url:"/GetCommitInfo"
>
>body:{
>
>​	owner:"ZJU-SEC",
>
>​	repo:"os22fall-stu"
>
>}
>
>返回格式
>
>{
>
>​	"msg":"success"
>
>}

### 1.2 GetAllCommitsOfRepo

>获取给定的仓库的所有commit信息
>
>method: POST
>
>url:"/GetAllCommitsOfRepo"
>
>body:{
>
>​	owner:"ZJU-SEC",
>
>​	repo:"os22fall-stu"
>
>}
>
>返回格式
>
>{
>
>​    "commits": [
>
>​        {
>
>​            "_id": "6378ca4125cf57eef133f286",
>
>​            "sha": "74597f67e4dd1c4b41b15bb54151959c142e6141",
>
>​            "url": "https://github.com/ZJU-SEC/os22fall-stu/commit/74597f67e4dd1c4b41b15bb54151959c142e6141",
>
>​            "author_id": 57927141,
>
>​            "author_name": "bittervan",
>
>​            "author_email": "xingkai.wang@outlook.com",
>
>​            "updated_at": "2022-11-13T02:58:45Z",
>
>​            "message": "adding faq for satp stuff",
>
>​            "repos_id": "536183460",
>
>​            "repo_owner": "ZJU-SEC",
>
>​            "repo_name": "os22fall-stu",
>
>​            "__v": 0
>
>​        },
>
>​	]
>
>}
>
>

### 1.3 GetRepoCommitFrequencyByYear

>获取给定的仓库的指定年份间的commit频率
>
>method: POST
>
>url:"/GetAllCommitsOfRepo"
>
>body:{
>
>​    "owner":"ZJU-SEC",
>
>​    "repo":"os22fall-stu",
>
>​    "begin":"2022-08-01",
>
>​    "tail":"2022-11-19"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "count": 87
>
>​        }
>
>​    ]
>
>}

### 1.4 GetRepoCommitFrequencyByMonth

>获取给定的仓库的指定月份间的commit频率
>
>method: POST
>
>url:"/GetRepoCommitFrequencyByMonth"
>
>body:{
>
>​    "owner":"ZJU-SEC",
>
>​    "repo":"os22fall-stu",
>
>​    "begin":"2022-08-01",
>
>​    "tail":"2022-11-19"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 8,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 9,
>
>​            "count": 59
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 10,
>
>​            "count": 20
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "count": 5
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 12,
>
>​            "count": 0
>
>​        }
>
>​    ]
>
>}

### 1.5 GetRepoCommitFrequencyByDay

>获取给定的仓库的指定日子间的commit频率
>
>method: POST
>
>url:"/GetRepoCommitFrequencyByDay"
>
>body:{
>
>​    "owner":"ZJU-SEC",
>
>​    "repo":"os22fall-stu",
>
>​    "begin":"2022-08-01",
>
>​    "tail":"2022-11-19"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 1,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 2,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 3,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 4,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 5,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 6,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 7,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 8,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 9,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 10,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 11,
>
>​            "count": 2
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 12,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 13,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 14,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 15,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 16,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 17,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 18,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 11,
>
>​            "day": 19,
>
>​            "count": 0
>
>​        }
>
>​    ]
>
>}
>
>

### 1.6 GetCommitersCountInRange

>获取给定的仓库的指定区间中逐月的累计commiter数量
>
>method: POST
>
>url:"/GetCommitersCountInRange"
>
>body:{
>
>​    "owner":"ZJU-SEC",
>
>​    "repo":"os22fall-stu",
>
>​    "begin":"2022-08-01",
>
>​    "tail":"2022-11-19"
>
>}
>
>返回格式
>
>[
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 11,
>
>​        "count": 2
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 12,
>
>​        "count": 2
>
>​    }
>
>]
>
>

## 2. pull

### 2.1 GetPullInfo

>获取给定的仓库的pull信息并存储
>
>method: POST
>
>url:"/GetPullInfo"
>
>body:{
>
>​	owner:"ZJU-SEC",
>
>​	repo:"os22fall-stu"
>
>}
>
>返回格式
>
>{
>
>​	"msg":"success"
>
>}

### 2.2 GetAllPullOfRepo

>获取给定的仓库的所有pull信息
>
>method: POST
>
>url:"/GetAllCommitsOfRepo"
>
>body:{
>
>​	owner:"ZJU-SEC",
>
>​	repo:"os22fall-stu"
>
>}
>
>返回格式
>
>{
>
>​    "pulls": [
>
>​        {
>
>​            "_id": "6378c548d1d597009589e930",
>
>​            "id": 900386431,
>
>​            "url": "https://github.com/RalXYZ/cc99/pull/4",
>
>​            "number": 4,
>
>​            "state": "closed",
>
>​            "title": "Resolve issue 1",
>
>​            "isLocked": **true**,
>
>​            "body": "test",
>
>​            "created_at": "2022-04-05T15:29:00Z",
>
>​            "updated_at": "2022-04-05T15:35:43Z",
>
>​            "closed_at": "2022-04-05T15:32:53Z",
>
>​            "is_merged": **true**,
>
>​            "repos_id": 470506662,
>
>​            "user_id": "13679605",
>
>​            "repo_owner": "RalXYZ",
>
>​            "repo_name": "cc99",
>
>​            "__v": 0
>
>​        }
>
>​    ]
>
>}

### 2.3 GetRepoPullUpdateFrequencyByYear

>获取给定的仓库的指定年份间的pull的update频率
>
>url:"/GetRepoPullUpdateFrequencyByYear"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "count": 10
>
>​        }
>
>​    ]
>
>}
>
>

### 2.4 获取给定的仓库的指定年份间的pull的close频率

>获取给定的仓库的指定年份间的pull的close频率
>
>url:"/GetRepoPullCloseFrequencyByYear"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "count": 9
>
>​        }
>
>​    ]
>
>}

### 2.5 获取给定的仓库的指定年份间的pull的Create频率

>获取给定的仓库的指定年份间的pull的Create频率
>
>url:"/GetRepoPullCreateFrequencyByYear"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "count": 10
>
>​        }
>
>​    ]
>
>}

### 2.6获取给定的仓库的指定月份间的pull的update频率

>获取给定的仓库的指定月份间的pull的update频率
>
>url:"/GetRepoPullUpdateFrequencyByMonth"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "count": 2
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "count": 4
>
>​        }
>
>​    ]
>
>}

### 2.7 获取给定的仓库的指定月份间的pull的close频率

>获取给定的仓库的指定月份间的pull的close频率
>
>url:"/GetRepoPullCloseFrequencyByMonth"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "count": 2
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "count": 6
>
>​        }
>
>​    ]
>
>}

### 2.8 获取给定的仓库的指定月份间的pull的create频率

>获取给定的仓库的指定月份间的pull的create频率
>
>url:"/GetRepoPullCloseFrequencyByMonth"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "count": 2
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "count": 6
>
>​        }
>
>​    ]
>
>}

### 2.9 获取给定的仓库的指定日子间的pull的update频率

>获取给定的仓库的指定日子间的pull的update频率
>
>url:"/GetRepoPullUpdateFrequencyByDay"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 23,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 24,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 25,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 26,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 27,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 28,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 29,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 30,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 1,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 2,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 3,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 4,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 5,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 6,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 7,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 8,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 9,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 10,
>
>​            "count": 0
>
>​        }
>
>​    ]
>
>}

### 2.10 获取给定的仓库的指定日子间的pull的close频率

>获取给定的仓库的指定日子间的pull的close频率
>
>url:"/GetRepoPullCloseFrequencyByDay"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 23,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 24,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 25,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 26,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 27,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 28,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 29,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 30,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 1,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 2,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 3,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 4,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 5,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 6,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 7,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 8,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 9,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 10,
>
>​            "count": 0
>
>​        }
>
>​    ]
>
>}
>
>

### 2.11 获取给定的仓库的指定日子间的pull的create频率

>获取给定的仓库的指定日子间的pull的create频率
>
>url:"/GetRepoPullCreateFrequencyByDay"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 23,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 24,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 25,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 26,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 27,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 28,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 29,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 30,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 1,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 2,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 3,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 4,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 5,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 6,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 7,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 8,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 9,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 10,
>
>​            "count": 0
>
>​        }
>
>​    ]
>
>}

### 2.12 获取给定的仓库在给定月份之间的累计commiter数量

>获取给定的仓库在给定月份之间的累计commiter数量
>
>url:"/GetPullersCountInRange"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>[
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 4,
>
>​        "count": 1
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 5,
>
>​        "count": 2
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 6,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 7,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 8,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 9,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 10,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 11,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 12,
>
>​        "count": 4
>
>​    }
>
>]

## 3. issue

### 3.1 GetIssueInfo

>获取给定的仓库的Issue信息并存储
>
>method: POST
>
>url:"/GetIssueInfo"
>
>body:{
>
>​    "owner":"npm",
>
>​    "repo":"node-semver",
>
>​    "begin": "2022-10-22",
>
>​    "tail":"2022-11-14"
>
>}
>
>返回格式
>
>{
>
>​	"msg":"success"
>
>}

### 3.2 GetAllIssueOfRepo

>获取给定的仓库的所有Issue信息
>
>method: POST
>
>url:"/GetAllIssueOfRepo"
>
>body:{
>
>​    "owner":"npm",
>
>​    "repo":"node-semver"
>
>}
>
>返回格式
>
>{
>
>​    {
>
>​    "issues": [
>
>​        {
>
>​            "_id": "6378b37ec681f9f8665e06a3",
>
>​            "id": 1446350194,
>
>​            "number": 503,
>
>​            "url": "https://github.com/npm/node-semver/issues/503",
>
>​            "title": "[FEATURE] - A function return versions in the list satisfies the range",
>
>​            "state": "open",
>
>​            "body": "A function returns versions in the list satisfies the range, similar to the function `maxSatisfying(versions, range)`, but returns the matched version list\r\n\r\n### Usage\r\n```\r\nsatisfyRange(versions, range)\r\n```\r\n\r\n### Example\r\n```\r\nsatisfyRange(['v1.0.0', 'v2.0.0', 'v2.0.1'], '2')\r\n\r\n// ['v2.0.0', 'v2.0.1']\r\n```\r\n",
>
>​            "created_at": "2022-11-12T09:22:00Z",
>
>​            "updated_at": "2022-11-13T05:20:58Z",
>
>​            "repos_id": 1357199,
>
>​            "user_id": 29809148,
>
>​            "user_name": "lvqq",
>
>​            "repo_owner": "npm",
>
>​            "repo_name": "node-semver",
>
>​            "__v": 0
>
>​        }
>
>​    ]
>
>}

### 3.3 获取给定的仓库的指定年份间的Issue的update频率

>获取给定的仓库的指定年份间的Issue的update频率
>
>url:"/GetRepoIssueUpdateFrequencyByYear"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "count": 162
>
>​        }
>
>​    ]
>
>}

### 3.4 获取给定的仓库的指定年份间的issue的close频率

>获取给定的仓库的指定年份间的Issue的close频率
>
>url:"/GetRepoIssueCloseFrequencyByYear"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "count": 9
>
>​        }
>
>​    ]
>
>}

### 3.5 获取给定的仓库的指定年份间的issue的Create频率

>获取给定的仓库的指定年份间的issue的Create频率
>
>url:"/GetRepoIssueCreateFrequencyByYear"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "count": 10
>
>​        }
>
>​    ]
>
>}

### 3.6 获取给定的仓库的指定月份间的issue的update频率

>url:"/GetRepoIssueUpdateFrequencyByMonth"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "count": 2
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "count": 4
>
>​        }
>
>​    ]
>
>}

### 3.7 获取给定的仓库的指定月份间的issue的close频率

>获取给定的仓库的指定月份间的issue的close频率
>
>url:"/GetRepoIssueCloseFrequencyByMonth"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "count": 2
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "count": 6
>
>​        }
>
>​    ]
>
>}

### 3.8 获取给定的仓库的指定月份间的issue的create频率

>获取给定的仓库的指定月份间的issue的create频率
>
>url:"/GetRepoIssueCreateFrequencyByMonth"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "count": 2
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "count": 6
>
>​        }
>
>​    ]
>
>}

### 3.9 获取给定的仓库的指定日子间的issue的update频率

>获取给定的仓库的指定日子间的issue的update频率
>
>url:"/GetRepoIssueUpdateFrequencyByDay"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 23,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 24,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 25,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 26,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 27,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 28,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 29,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 30,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 1,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 2,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 3,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 4,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 5,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 6,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 7,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 8,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 9,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 10,
>
>​            "count": 0
>
>​        }
>
>​    ]
>
>}

### 3.10 获取给定的仓库的指定日子间的issue的close频率

>获取给定的仓库的指定日子间的issue的close频率
>
>url:"/GetRepoIssueCloseFrequencyByDay"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 23,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 24,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 25,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 26,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 27,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 28,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 29,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 30,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 1,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 2,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 3,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 4,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 5,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 6,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 7,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 8,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 9,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 10,
>
>​            "count": 0
>
>​        }
>
>​    ]
>
>}
>
>

### 3.11 获取给定的仓库的指定日子间的issue的close频率

>获取给定的仓库的指定日子间的issue的close频率
>
>url:"/GetRepoIssueCreateFrequencyByDay"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>{
>
>​    "arr": [
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 23,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 24,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 25,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 26,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 27,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 28,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 29,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 4,
>
>​            "day": 30,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 1,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 2,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 3,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 4,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 5,
>
>​            "count": 1
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 6,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 7,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 8,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 9,
>
>​            "count": 0
>
>​        },
>
>​        {
>
>​            "year": 2022,
>
>​            "month": 5,
>
>​            "day": 10,
>
>​            "count": 0
>
>​        }
>
>​    ]
>
>}

### 3.12 获取给定的仓库在给定月份之间的累计issuer数量

>获取给定的仓库在给定月份之间的累计issuer数量
>
>url:"/GetIssuersCountInRange"
>
>method: POST
>
>body:{
>
>​    "owner":"RalXYZ",
>
>​    "repo":"cc99",
>
>​    "begin":"2022-04-23",
>
>​    "tail":"2022-05-10"
>
>}
>
>返回格式
>
>[
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 4,
>
>​        "count": 1
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 5,
>
>​        "count": 2
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 6,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 7,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 8,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 9,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 10,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 11,
>
>​        "count": 4
>
>​    },
>
>​    {
>
>​        "year": 2022,
>
>​        "month": 12,
>
>​        "count": 4
>
>​    }
>
>]

## 4. CoreContributor

### 4.1 获取给定的仓库在 2019-2022 年间的核心贡献者和其公司分布

> 获取 2019-2022 四年间每年的核心贡献者（定义为贡献了 80% 的 commits 的人群）及其公司分布，未在个人资料中标记公司的，记为 `other` 。
>
> url: "/GetCoreContributorByYear"
>
> method: POST
>
> body: 
>
> ```json
> {
> 
> 	"owner": "QSCTech",
> 
> 	"repo": "zju-icicles"
> 
> }
> ```
>
> 返回格式：
>
> ```json
> {
>     "coreContributorByYear": [
>         {
>             "year": 2019,
>             "coreContributor": [
>                 {
>                     "contributor": "iwzy7071",
>                     "commit": 42
>                 },
>                 {
>                     "contributor": "tespent",
>                     "commit": 27
>                 },
>                 {
>                     "contributor": "h-lujian",
>                     "commit": 24
>                 },
>                 {
>                     "contributor": "QSCTech-Sange",
>                     "commit": 14
>                 },
>                 {
>                     "contributor": "fish98",
>                     "commit": 14
>                 },
>                 {
>                     "contributor": "JiangTanZJU",
>                     "commit": 9
>                 },
>                 {
>                     "contributor": "nonohh",
>                     "commit": 9
>                 },
>                 {
>                     "contributor": "Gk0Wk",
>                     "commit": 8
>                 },
>                 {
>                     "contributor": "megrxu",
>                     "commit": 8
>                 },
>                 {
>                     "contributor": "determ1ne",
>                     "commit": 6
>                 }
>             ],
>             "coreContributorCompany": [
>                 {
>                     "company": "other",
>                     "coreContributors": 5
>                 },
>                 {
>                     "company": "Zhejiang University",
>                     "coreContributors": 3
>                 },
>                 {
>                     "company": "Hangzhou University",
>                     "coreContributors": 1
>                 },
>                 {
>                     "company": "@QSCTech",
>                     "coreContributors": 1
>                 }
>             ]
>         },
>         {
>             "year": 2020,
>             "coreContributor": [
>                 {
>                     "contributor": "dougefla",
>                     "commit": 84
>                 },
>                 {
>                     "contributor": "tespent",
>                     "commit": 63
>                 },
>                 {
>                     "contributor": "CHN-ChenYi",
>                     "commit": 39
>                 },
>                 {
>                     "contributor": "HAO Jiahui",
>                     "commit": 21
>                 },
>                 {
>                     "contributor": "Lokilankaaa",
>                     "commit": 15
>                 },
>                 {
>                     "contributor": "QSCTech-Sange",
>                     "commit": 15
>                 },
>                 {
>                     "contributor": "Phantom1003",
>                     "commit": 12
>                 },
>                 {
>                     "contributor": "Yao-Shao",
>                     "commit": 9
>                 },
>                 {
>                     "contributor": "Ais0n",
>                     "commit": 9
>                 },
>                 {
>                     "contributor": "yu-cao",
>                     "commit": 9
>                 },
>                 {
>                     "contributor": "Shaw Haines",
>                     "commit": 9
>                 }
>             ],
>             "coreContributorCompany": [
>                 {
>                     "company": "other",
>                     "coreContributors": 6
>                 },
>                 {
>                     "company": "Zhejiang University",
>                     "coreContributors": 4
>                 },
>                 {
>                     "company": "Tencent Games",
>                     "coreContributors": 1
>                 }
>             ]
>         },
>         {
>             "year": 2021,
>             "coreContributor": [
>                 {
>                     "contributor": "LukeLIN-web",
>                     "commit": 78
>                 },
>                 {
>                     "contributor": "palemoons",
>                     "commit": 54
>                 },
>                 {
>                     "contributor": "OE-Heart",
>                     "commit": 30
>                 },
>                 {
>                     "contributor": "Mythologyli",
>                     "commit": 30
>                 },
>                 {
>                     "contributor": "CHN-ChenYi",
>                     "commit": 21
>                 },
>                 {
>                     "contributor": "747745124",
>                     "commit": 12
>                 },
>                 {
>                     "contributor": "wandleshen",
>                     "commit": 12
>                 },
>                 {
>                     "contributor": "NonoHh",
>                     "commit": 12
>                 }
>             ],
>             "coreContributorCompany": [
>                 {
>                     "company": "Zhejiang University",
>                     "coreContributors": 4
>                 },
>                 {
>                     "company": "other",
>                     "coreContributors": 3
>                 },
>                 {
>                     "company": "UC Santa Barbara",
>                     "coreContributors": 1
>                 }
>             ]
>         },
>         {
>             "year": 2022,
>             "coreContributor": [
>                 {
>                     "contributor": "palemoons",
>                     "commit": 80
>                 },
>                 {
>                     "contributor": "Jack-Chan-2001",
>                     "commit": 69
>                 },
>                 {
>                     "contributor": "OE-Heart",
>                     "commit": 42
>                 },
>                 {
>                     "contributor": "LukeLIN-web",
>                     "commit": 30
>                 },
>                 {
>                     "contributor": "RuibaiXu",
>                     "commit": 18
>                 },
>                 {
>                     "contributor": "SoonWhy",
>                     "commit": 15
>                 },
>                 {
>                     "contributor": "huiwu321",
>                     "commit": 6
>                 },
>                 {
>                     "contributor": "permui",
>                     "commit": 6
>                 },
>                 {
>                     "contributor": "HIGHBu",
>                     "commit": 6
>                 },
>                 {
>                     "contributor": "NonoHh",
>                     "commit": 6
>                 }
>             ],
>             "coreContributorCompany": [
>                 {
>                     "company": "Zhejiang University",
>                     "coreContributors": 4
>                 },
>                 {
>                     "company": "other",
>                     "coreContributors": 4
>                 },
>                 {
>                     "company": "ZJU",
>                     "coreContributors": 2
>                 }
>             ]
>         }
>     ]
> }
> ```

## 5. PopularTopics

### 5.1 获取对应主题的 issue 和 pr 在一定时间段内的总数

> GET http://beet.asia:9200/doublec_pytorch/_search
>
> 不同主题需要不同的 body，body 形式如下：
>
> ```json
> {
>   "min_score": 0,
>   "query":{
>     "bool": {
>       "should": [
>         {
>           "query_string": {
>             "query": "docs"
>           }
>         },
>         {
>           "query_string": {
>             "query": "typo"
>           }
>         }
>       ], 
>       "minimum_should_match": 1, 
>       "filter": [
>         {
>           "terms": {
>             "_type": ["issues", "pulls"]
>           }
>         },
>         {
>           "term": {
>             "repos_id": 65600975
>           }
>         },
>         {
>           "range": {
>             "created_at": {
>               "gte": "2022-01-01 04:00:00", 
>               "lte": "2023-01-01 04:59:59",
>               "format": "yyyy-MM-dd HH:mm:ss"
>             }
> 	        }
>         }
>       ]
>     }
>   }
> }
> ```
>
> 需要将 `created_at` 内的开始/结束时间修改为需要的值，`repos_id` 为仓库 id。
>
> `should` 内的关键词为区分不同主题的方法，不同主题的 `should` 如下，建议将其保存为常量后调用：
>
> + 代码
>
>   ```json
>   [
>       {
>           "query_string": {
>               "query": "dependency"
>           }
>       },
>       {
>           "query_string": {
>               "query": "rebuild"
>           }
>       },
>       {
>           "query_string": {
>               "query": "add"
>           }
>       },
>       {
>           "query_string": {
>               "query": "implement"
>           }
>       },
>       {
>           "query_string": {
>               "query": "restruct"
>           }
>       },
>       {
>           "query_string": {
>               "query": "construct"
>           }
>       },
>       {
>           "query_string": {
>               "query": "feature"
>           }
>       }
>   ]
>   ```
>
> + 可维护性
>
>   ```json
>   {
>       "query_string": {
>           "query": "support"
>       }
>   },
>   {
>       "query_string": {
>           "query": "standard"
>       }
>   },
>   {
>       "query_string": {
>           "query": "format"
>       }
>   }
>   ```
>
> + 鲁棒性
>
>   ```json
>   [
>       {
>           "query_string": {
>               "query": "robust"
>           }
>       },
>       {
>           "query_string": {
>               "query": "error"
>           }
>       },
>       {
>           "query_string": {
>               "query": "fail"
>           }
>       },
>       {
>           "query_string": {
>               "query": "bug"
>           }
>       }
>   ]
>   ```
>
> + 性能
>
>   ```json
>   [
>       {
>           "query_string": {
>               "query": "boost"
>           }
>       },
>       {
>           "query_string": {
>               "query": "speed"
>           }
>       },
>       {
>           "query_string": {
>               "query": "performance"
>           }
>       }
>   ]
>   ```
>
> + 配置
>
>   ```json
>   [
>       {
>           "query_string": {
>               "query": "config"
>           }
>       },
>       {
>           "query_string": {
>               "query": "property"
>           }
>       },
>       {
>           "query_string": {
>               "query": "attribute"
>           }
>       }
>   ]
>   ```
>
> + 文档
>
>   ```json
>   [
>       {
>           "query_string": {
>               "query": "docs"
>           }
>       },
>       {
>           "query_string": {
>               "query": "typo"
>           }
>       }
>   ]
>   ```
>
> + 测试
>
>   ```json
>   [
>       {
>           "query_string": {
>               "query": "Unit Test"
>           }
>       },
>       {
>           "query_string": {
>               "query": "CI"
>           }
>       },
>       {
>           "query_string": {
>               "query": "Integration Test"
>           }
>       },
>       {
>           "query_string": {
>               "query": "Regression Test"
>           }
>       },
>       {
>           "query_string": {
>               "query": "pass"
>           }
>       }
>   ]
>   ```
>
> 你将获得的结果，从最开头获取 `hits.total` 即为命中的 issue/pr 总数：
>
> ```json
> {
>     "took": 10,
>     "timed_out": false,
>     "_shards": {
>         "total": 5,
>         "successful": 5,
>         "skipped": 0,
>         "failed": 0
>     },
>     "hits": {
>         "total": 1476,
>         "max_score": 12.6008415,
>         "hits": [
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "issues",
>                 "_id": "6384e747c366720f19c291bb",
>                 "_score": 12.6008415,
>                 "_source": {
>                     "id": 1154262142,
>                     "number": 73511,
>                     "url": "https://github.com/pytorch/pytorch/pull/73511",
>                     "title": "pytorch: fix typo in quantization docs",
>                     "state": "closed",
>                     "body": "Stack from [ghstack](https://github.com/ezyang/ghstack):\n* **#73511 pytorch: fix typo in quantization docs**\n\nSummary:\n\nFixes typo in describing the `torch.qint32` data type.\n\nTest plan: CI\n\nDifferential Revision: [D34522741](https://our.internmc.facebook.com/intern/diff/D34522741)",
>                     "created_at": "2022-02-28T15:58:44Z",
>                     "updated_at": "2022-03-04T16:35:51Z",
>                     "closed_at": "2022-02-28T23:12:00Z",
>                     "repos_id": 65600975,
>                     "user_id": 1622561,
>                     "user_name": "vkuzo",
>                     "comment_count": 3,
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "cla signed",
>                         "release notes: quantization",
>                         "topic: documentation"
>                     ]
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "pulls",
>                 "_id": "6384e7fcc366720f19c325da",
>                 "_score": 12.59544,
>                 "_source": {
>                     "id": 1096818166,
>                     "url": "https://github.com/pytorch/pytorch/pull/87583",
>                     "number": 87583,
>                     "state": "closed",
>                     "title": "Fix typo under docs directory",
>                     "isLocked": false,
>                     "body": "This PR fixes typo in `.rst` files under docs directory\r\n",
>                     "created_at": "2022-10-24T02:18:56Z",
>                     "updated_at": "2022-10-25T04:43:18Z",
>                     "closed_at": "2022-10-25T04:43:18Z",
>                     "is_merged": false,
>                     "repos_id": 65600975,
>                     "user_id": "1315079",
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "open source",
>                         "Merged",
>                         "ciflow/trunk"
>                     ]
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "pulls",
>                 "_id": "6384e80ec366720f19c3337b",
>                 "_score": 12.59544,
>                 "_source": {
>                     "id": 1071531512,
>                     "url": "https://github.com/pytorch/pytorch/pull/85896",
>                     "number": 85896,
>                     "state": "closed",
>                     "title": "Fix typo under docs directory and RELEASE.md",
>                     "isLocked": false,
>                     "body": "This PR fixes typo in rst files under docs directory and `RELEASE.md`.\r\n",
>                     "created_at": "2022-09-29T15:45:30Z",
>                     "updated_at": "2022-09-30T01:03:17Z",
>                     "closed_at": "2022-09-30T01:03:17Z",
>                     "is_merged": false,
>                     "repos_id": 65600975,
>                     "user_id": "1315079",
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "open source",
>                         "Merged",
>                         "cla signed",
>                         "ciflow/trunk"
>                     ]
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "pulls",
>                 "_id": "638b743796996c3be29998c9",
>                 "_score": 12.523436,
>                 "_source": {
>                     "id": 866936979,
>                     "url": "https://github.com/pytorch/pytorch/pull/73511",
>                     "number": 73511,
>                     "state": "closed",
>                     "title": "pytorch: fix typo in quantization docs",
>                     "isLocked": false,
>                     "body": "Stack from [ghstack](https://github.com/ezyang/ghstack):\n* **#73511 pytorch: fix typo in quantization docs**\n\nSummary:\n\nFixes typo in describing the `torch.qint32` data type.\n\nTest plan: CI\n\nDifferential Revision: [D34522741](https://our.internmc.facebook.com/intern/diff/D34522741)",
>                     "created_at": "2022-02-28T15:58:43Z",
>                     "updated_at": "2022-03-04T16:35:51Z",
>                     "closed_at": "2022-02-28T23:12:00Z",
>                     "is_merged": false,
>                     "repos_id": 65600975,
>                     "user_id": "1622561",
>                     "labels": [
>                         "cla signed",
>                         "release notes: quantization",
>                         "topic: documentation"
>                     ],
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 0
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "issues",
>                 "_id": "6384e6bfc366720f19c2013d",
>                 "_score": 12.376833,
>                 "_source": {
>                     "id": 1397945561,
>                     "number": 86273,
>                     "url": "https://github.com/pytorch/pytorch/pull/86273",
>                     "title": "Docs: fix typo",
>                     "state": "closed",
>                     "body": "Typo in torch.fx.Interpreter.fetch_attr docs",
>                     "created_at": "2022-10-05T15:00:31Z",
>                     "updated_at": "2022-10-06T22:39:42Z",
>                     "closed_at": "2022-10-06T22:39:02Z",
>                     "repos_id": 65600975,
>                     "user_id": 33100427,
>                     "user_name": "cherrywoods",
>                     "comment_count": 6,
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "open source",
>                         "Merged",
>                         "ciflow/trunk",
>                         "release notes: fx",
>                         "fx"
>                     ]
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "issues",
>                 "_id": "6384e742c366720f19c28d96",
>                 "_score": 12.376833,
>                 "_source": {
>                     "id": 1162190164,
>                     "number": 73901,
>                     "url": "https://github.com/pytorch/pytorch/issues/73901",
>                     "title": "[torchrec] Minor typo",
>                     "state": "open",
>                     "body": "### 📚 The doc issue\n\nMinor typo\r\nIn TORCHREC.DATASETS docs, \"pr-eprocessing\" -> \"pre-processing\"\n\n### Suggest a potential alternative/fix\n\n_No response_\n\ncc @brianjo @mruberry",
>                     "created_at": "2022-03-08T04:00:44Z",
>                     "updated_at": "2022-03-08T21:57:17Z",
>                     "repos_id": 65600975,
>                     "user_id": 36599490,
>                     "user_name": "cieske",
>                     "comment_count": 0,
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "module: docs",
>                         "triaged"
>                     ]
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "pulls",
>                 "_id": "6384e80cc366720f19c33187",
>                 "_score": 12.28946,
>                 "_source": {
>                     "id": 1077476614,
>                     "url": "https://github.com/pytorch/pytorch/pull/86273",
>                     "number": 86273,
>                     "state": "closed",
>                     "title": "Docs: fix typo",
>                     "isLocked": false,
>                     "body": "Typo in torch.fx.Interpreter.fetch_attr docs",
>                     "created_at": "2022-10-05T15:00:31Z",
>                     "updated_at": "2022-10-06T22:39:42Z",
>                     "closed_at": "2022-10-06T22:39:42Z",
>                     "is_merged": false,
>                     "repos_id": 65600975,
>                     "user_id": "33100427",
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "open source",
>                         "Merged",
>                         "ciflow/trunk",
>                         "release notes: fx",
>                         "fx"
>                     ]
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "issues",
>                 "_id": "6384e6c2c366720f19c203ba",
>                 "_score": 12.259321,
>                 "_source": {
>                     "id": 1391092640,
>                     "number": 85896,
>                     "url": "https://github.com/pytorch/pytorch/pull/85896",
>                     "title": "Fix typo under docs directory and RELEASE.md",
>                     "state": "closed",
>                     "body": "This PR fixes typo in rst files under docs directory and `RELEASE.md`.\r\n",
>                     "created_at": "2022-09-29T15:45:30Z",
>                     "updated_at": "2022-09-30T01:03:17Z",
>                     "closed_at": "2022-09-29T21:42:13Z",
>                     "repos_id": 65600975,
>                     "user_id": 1315079,
>                     "user_name": "kiszk",
>                     "comment_count": 5,
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "open source",
>                         "Merged",
>                         "cla signed",
>                         "ciflow/trunk"
>                     ]
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "issues",
>                 "_id": "6384e6b1c366720f19c1f06e",
>                 "_score": 12.21888,
>                 "_source": {
>                     "id": 1420082779,
>                     "number": 87583,
>                     "url": "https://github.com/pytorch/pytorch/pull/87583",
>                     "title": "Fix typo under docs directory",
>                     "state": "closed",
>                     "body": "This PR fixes typo in `.rst` files under docs directory\r\n",
>                     "created_at": "2022-10-24T02:18:56Z",
>                     "updated_at": "2022-10-25T04:43:18Z",
>                     "closed_at": "2022-10-24T23:52:49Z",
>                     "repos_id": 65600975,
>                     "user_id": 1315079,
>                     "user_name": "kiszk",
>                     "comment_count": 5,
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "open source",
>                         "Merged",
>                         "ciflow/trunk"
>                     ]
>                 }
>             },
>             {
>                 "_index": "doublec_pytorch",
>                 "_type": "pulls",
>                 "_id": "6384e864c366720f19c36e23",
>                 "_score": 12.086642,
>                 "_source": {
>                     "id": 956673575,
>                     "url": "https://github.com/pytorch/pytorch/pull/78784",
>                     "number": 78784,
>                     "state": "closed",
>                     "title": "[FSDP][Docs] Fix typo in `full_optim_state_dict()`",
>                     "isLocked": false,
>                     "body": "Stack from [ghstack](https://github.com/ezyang/ghstack):\r\n* #78599 [FSDP] Allow different `optim_input` orders across ranks\r\n* **#78784 [FSDP][Docs] Fix typo in `full_optim_state_dict()`**\r\n\r\nThis fixes a typo in the docstring of `full_optim_state_dict()`, where `False` and `True` were incorrectly mixed.",
>                     "created_at": "2022-06-03T00:17:00Z",
>                     "updated_at": "2022-06-07T00:34:48Z",
>                     "closed_at": "2022-06-07T00:34:48Z",
>                     "is_merged": false,
>                     "repos_id": 65600975,
>                     "user_id": "31054793",
>                     "repo_owner": "pytorch",
>                     "repo_name": "pytorch",
>                     "__v": 1,
>                     "labels": [
>                         "oncall: distributed",
>                         "Merged",
>                         "cla signed",
>                         "release notes: distributed (fsdp)",
>                         "topic: documentation"
>                     ]
>                 }
>             }
>         ]
>     }
> }
> ```