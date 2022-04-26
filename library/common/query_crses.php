<?php
/*查询课程信息的脚本*/
//获取GET请求的数据
$usrID = $_GET["UsrID"];
$usrRole = $_GET["UsrRole"];
$colgAbrv = $_GET["ColgAbrv"];
$mjrAbrv = $_GET["MjrAbrv"];
$searchItem = $_GET["searchItem"];
$searchType = $_GET["searchType"];

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

//设置查询关键词
$searchItem = "%" . $searchItem . "%";

//查询数据库
switch ($usrRole) {
    case "std":
        if ($searchType === "UsrName") $query = "SELECT C.CrseID, C.CrseName, U.UsrName FROM User AS U, Course AS C " .
        "WHERE U.UsrID = C.UsrID AND U.MjrAbrv = ? AND U.UsrName LIKE ?";
        else $query = "SELECT C.CrseID, C.CrseName, U.UsrName FROM User AS U, Course AS C " .
        "WHERE U.UsrID = C.UsrID AND U.MjrAbrv = ? AND C." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $mjrAbrv, $searchItem);
        break;
    case "tch":
        $query = "SELECT C.CrseID, C.CrseName, U.UsrName FROM User AS U, Course AS C " .
        "WHERE U.UsrID = C.UsrID AND C.UsrID = ? AND C." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $usrID, $searchItem);
        break;
    case "admin":
        if ($searchType === "UsrName") $query = "SELECT C.CrseID, C.CrseName, U.UsrName FROM User AS U, Course AS C " .
        "WHERE U.UsrID = C.UsrID AND U.ColgAbrv = ? AND U.UsrName LIKE ?";
        else $query = "SELECT C.CrseID, C.CrseName, U.UsrName FROM User AS U, Course AS C " .
        "WHERE U.UsrID = C.UsrID AND U.ColgAbrv = ? AND C." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $colgAbrv, $searchItem);
        break;
}
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$crses = $result->fetch_all(MYSQLI_ASSOC);
$crsesJSON = json_encode($crses, JSON_UNESCAPED_UNICODE);
echo $crsesJSON;

//将JSON数据写入文件
file_put_contents("crses.json", $crsesJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>