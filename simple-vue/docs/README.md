

## Microsoft Edge Issue
用Edge或IE瀏覽docx/doc的時候，暫存檔的位置在 
`<user home>/AppData/Local/Packages/Microsoft.MicrosoftEdge_xxxxxxx/TempState/Downloads`或`<user home>/AppData/Local/Packages/????`目錄裡，
瀏覽器關掉後會清空。

## Chrome Issue
2015000042.pdf 在 Chrome 裡面因缺少字形而變成亂碼，加裝 PDF Viewer 2.0.673 擴充功能就可解決。 doc/docx 檔裡面的數學式子錯亂。


## IE 11 issue
IE11 不支援 arrow functions 與 Promise，必須使用 polyfill 才行，暫時放棄。

## 客製化 Solr config set
為了解決中文字的同形異碼問題，在 `index > analysis` 的開頭多一個字元過濾。有些中文的異碼字不屬於Letter，故在 Query 的時候無法處理。方法如下：
1. 複製一份server\solr\configsets\sample_techproducts_configs到server\solr\configsets\yh
1. 將 yh\conf\managed-schema 裡面
`<fieldType name="text_general" class="solr.TextField" positionIncrementGap="100">`
    `<analyzer type="index">` 的開頭增加成一個
        `<charFilter class="solr.MappingCharFilterFactory" mapping="mapping-FoldToASCII.txt" />`
1. 將 yh\conf\mapping-FoldToASCII.txt 的後面增加
```
# 同形異碼
"㈻" => "學"
"林" => "林"
"㆙" => "甲"
```
為了處理英文的 stopword 問題
* 將 yh\conf\lang\stopword_en.txt 裡面的 stop word 內容抄到 yh\conf\stopword.txt 的尾巴

為了處理英文的 stem 問題


* 將 yh\conf\managed-schema 中
`<fieldType name="text_general" class="solr.TextField" positionIncrementGap="100">` 的
`<analyzer type="index">`與`<analyzer type="query">` 裡面 `<tokenizer>`的後面都增加 `<filter class="solr.PorterStemFilterFactory"/>`



## 一次性初始設定 Solrcloud 環境
在 d:\solr-7.5.0 裡面，執行
```
md d:\yhcloud\node1\solr
md d:\yhcloud\node2\solr
copy server\solr\solr.xml d:\yhcloud\node1\solr
copy server\solr\solr.xml d:\yhcloud\node2\solr
copy server\solr\zoo.cfg d:\yhcloud\node1\solr
copy server\solr\zoo.cfg d:\yhcloud\node2\solr
```
## 啟動 Solrcloud
```
.\bin\solr.cmd start -c -p 8983 -s d:\yhcloud\node1\solr
.\bin\solr.cmd start -c -p 7574 -s d:\yhcloud\node2\solr -z localhost:9983
```
## 新增 allsortofdocuments文件集
```
bin\solr create -c allsortofdocuments -d server\solr\configsets\yh -s 2 -rf 2
```
## 新增 allsortofdocuments文件集裡面的文件
```
java -jar -Dc=allsortofdocuments -Dauto -Drecursive=yes example\exampledocs\post.jar d:\data\allsortofdocuments
```
## 刪除 allsortofdocuments文件集裡面的所有文件
```
java -Ddata=args -Dc=allsortofdocuments -jar example\exampledocs\post.jar "<delete><query>*:*</query></delete>"
```

## 移除 allsortofdocuments文件集 
```
bin\solr delete -c allsortofdocuments
```
## 關掉 Solrcloud
```
bin\solr stop -all
```
## 查詢 solr 的狀態
```
bin\solr status
```
## 查詢文件集清單
`http://192.168.182.80:8983/solr/admin/collections?action=list`

## 管理 UI
`http://192.168.182.80:8983/solr/`

## velocity 查詢UI
`http://192.168.182.80:8983/solr/allsortofocuments/browse`

## 一次性初始設定 Standalone 環境
在 d:\solr-7.5.0 裡面，執行
```
md d:\yhstandalone\solr
copy server\solr\solr.xml d:\yhstandalone\solr
copy server\solr\zoo.cfg d:\yhstandalone\solr
```
## 啟動 Solr Standalone
```
.\bin\solr.cmd start -p 8983 -s d:\yhstandalone\solr
```
## 新增 allsortofdocuments文件集到 Solr Standalone
```
bin\solr create -c allsortofdocuments -d server\solr\configsets\yh
```
## 架設查詢網站
* 用 IIS 管理員架設新站台，用TCP 9123阜繫結
* 防火牆設定，查詢網頁網站所在的電腦防火牆輸入規則要允許TCP阜9123,8983,7574,9983，其中後面的三個是Solr Server 在使用

## 查詢方式
瀏覽 `http://192.168.182.80:9123`

## 測試注意事項
瀏覽器的cache要經查清除。

