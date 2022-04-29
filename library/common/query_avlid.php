<?php
/*查询可用的小组成员ID的脚本*/
//获取GET请求的数据
$crseID = intval($_GET["crseID"]);

//引入数据库用户信息脚本
require_once("../dbuser/student.php");

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "SELECT S.UsrID FROM Schedule AS S WHERE S.CrseID = ? AND " .
"S.UsrID NOT IN (SELECT M.UsrID FROM Party AS P, Member AS M WHERE P.CrseID = ? AND P.PtyID = M.PtyID)";
$stmt = $db->prepare($query);
$stmt->bind_param("ii", $crseID, $crseID);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$usrs = $result->fetch_all(MYSQLI_ASSOC);
$usrsJSON = json_encode($usrs, JSON_UNESCAPED_UNICODE);
echo $usrsJSON;

//将JSON数据写入文件
// file_put_contents("usrs.json", $usrsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>