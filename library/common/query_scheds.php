<?php
/*查询学生选课记录的脚本*/
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

if ($searchType === "UsrName") $query = "SELECT C.CrseID, C.CrseName, U.UsrName FROM User AS U, Course AS C, Schedule AS S " .
"WHERE U.UsrID = C.UsrID AND C.CrseID = S.CrseID AND S.UsrID = ? AND U.UsrName LIKE ? ORDER BY C.CrseID";
else $query = "SELECT C.CrseID, C.CrseName, U.UsrName FROM User AS U, Course AS C, Schedule AS S " .
"WHERE U.UsrID = C.UsrID AND C.CrseID = S.CrseID AND S.UsrID = ? AND C." . $searchType . " LIKE ? ORDER BY C.CrseID";
$stmt = $db->prepare($query);
$stmt->bind_param("ss", $usrID, $searchItem);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$scheds = $result->fetch_all(MYSQLI_ASSOC);
$schedsJSON = json_encode($scheds, JSON_UNESCAPED_UNICODE);
echo $schedsJSON;

//将JSON数据写入文件
// file_put_contents("scheds.json", $schedsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>