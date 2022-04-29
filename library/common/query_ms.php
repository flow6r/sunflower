<?php
/*查询学生作业记录的脚本*/
//获取GET请求的数据
//获取GET请求的数据
$usrID = $_GET["usrID"];
$searchItem = $_GET["searchItem"];
$searchType = $_GET["searchType"];

//引入数据库用户信息脚本
require_once("../dbuser/student.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//设置查询关键词
$searchItem = "%" . $searchItem . "%";

//检查关键词
if ($searchType === "MsStat") {
    if (preg_match("/未完/", $searchItem)) $searchItem = "incmpl";
    else if (preg_match("/完/", $searchItem)) $searchItem = "cmpled";
    else { echo "请输入正确的查询关键词"; exit; }
}

//查询数据库
switch ($searchType) {
    case "MsName":
        $query = "SELECT M.MsID, M.MsName, P.MsStat, U.UsrName FROM User AS U, Mission AS M, Progress AS P " .
        "WHERE M.MsID = P.MsID AND U.UsrID = M.UsrID AND P.UsrID = ? AND M." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $usrID, $searchItem);
        break;
    case "MsStat":
        $query = "SELECT M.MsID, M.MsName, P.MsStat, U.UsrName FROM User AS U, Mission AS M, Progress AS P " .
        "WHERE M.MsID = P.MsID AND U.UsrID = M.UsrID AND P.UsrID = ? AND P." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $usrID, $searchItem);
        break;
    case "UsrName":
        $query = "SELECT M.MsID, M.MsName, P.MsStat, U.UsrName FROM User AS U, Mission AS M, Progress AS P " .
        "WHERE M.MsID = P.MsID AND U.UsrID = M.UsrID AND P.UsrID = ? AND U." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $usrID, $searchItem);
        break;
}
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$ms = $result->fetch_all(MYSQLI_ASSOC);
$msJSON = json_encode($ms, JSON_UNESCAPED_UNICODE);
echo $msJSON;

//将JSON数据写入文件
// file_put_contents("ms.json", $msJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>