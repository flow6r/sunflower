<?php
/*查询成就记录的脚本*/
//获取GET请求的数据
$usrID = $_GET["usrID"];
$usrRole = $_GET["usrRole"];
$colgAbrv = $_GET["colgAbrv"];
$mjrAbrv = $_GET["mjrAbrv"];
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
        if ($searchType === "UsrName") $query = "SELECT A.*, U.UsrName FROM Achievement AS A, User AS U " .
        "WHERE A.UsrID = U.UsrID AND U.MjrAbrv = ? AND U.UsrRole = 'std' AND U." . $searchType . " LIKE ?";
        else $query = "SELECT A.*, U.UsrName FROM Achievement AS A, User AS U " .
        "WHERE A.UsrID = U.UsrID AND U.MjrAbrv = ? AND U.UsrRole = 'std' AND A." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $mjrAbrv, $searchItem); break;
    case "tch":
        if ($searchType === "UsrName") $query = "SELECT A.*, U.UsrName FROM Achievement AS A, User AS U " .
        "WHERE A.UsrID = U.UsrID AND U.MjrAbrv = ? AND U.UsrRole != 'admin' AND U." . $searchType . " LIKE ?";
        else $query = "SELECT A.*, U.UsrName FROM Achievement AS A, User AS U " .
        "WHERE A.UsrID = U.UsrID AND U.MjrAbrv = ? AND U.UsrRole != 'admin' AND A." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $mjrAbrv, $searchItem); break;
    case "admin":
        if ($searchType === "UsrName") $query = "SELECT A.*, U.UsrName FROM Achievement AS A, User AS U " .
        "WHERE A.UsrID = U.UsrID AND U.ColgAbrv = ? AND U." . $searchType . " LIKE ?";
        else $query = "SELECT A.*, U.UsrName FROM Achievement AS A, User AS U " .
        "WHERE A.UsrID = U.UsrID AND U.ColgAbrv = ? AND A." . $searchType . " LIKE ?";
        $stmt = $db->prepare($query);
        $stmt->bind_param("ss", $colgAbrv, $searchItem); break;
} $stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$achv = $result->fetch_all(MYSQLI_ASSOC);
$achvJSON = json_encode($achv, JSON_UNESCAPED_UNICODE);
echo $achvJSON;

//将JSON数据写入文件
// file_put_contents("achv.json", $achvJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>