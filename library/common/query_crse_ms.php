<?php
/*查询课程任务记录的脚本*/
//获取GET请求的数据
$crseID = intval($_GET["crseID"]);
$usrRole = $_GET["usrRole"];

//引入数据库用户信息脚本
switch ($usrRole) {
    case "std":
        require_once("../dbuser/student.php");
        break;
    case "tch":
        require_once("../dbuser/teacher.php");
        break;
    case "admin":
        require_once("../dbuser/admin.php");
        break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//查询课程
$query = "SELECT M.MsID, M.MsName, M.MsDesc, M.CrseID, M.UsrID, U.UsrName FROM " .
"Mission AS M, User AS U WHERE CrseID = ? AND M.UsrID = U.UsrID";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $crseID);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$crseMs = $result->fetch_all(MYSQLI_ASSOC);
$crseMsJSON = json_encode($crseMs, JSON_UNESCAPED_UNICODE);
echo $crseMsJSON;

//将JSON数据写入文件
// file_put_contents("crseMs.json", $crseMsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>