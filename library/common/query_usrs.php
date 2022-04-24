<?php
/*查询用户的脚本*/
//获取GET请求的数据
$usrRole = $_GET["usrRole"];
$colgAbrv = $_GET["colgAbrv"];
$mjrAbrv = $_GET["mjrAbrv"];
$trgtRole = $_GET["trgtRole"];
$searchItem = $_GET["searchItem"];
$searchType = $_GET["searchType"];

//引入数据库用户信息脚本
switch ($usrRole) {
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

//检查查询关键词
if ($searchType === "UsrGen") {
    if (preg_match("/男/", $searchItem)) $searchItem = "male";
    else if (preg_match("/女/", $searchItem)) $searchItem = "female";
    else { echo "请输入正确的查询关键词"; exit; }

    switch ($usrRole) {
        case "tch":
            $query = "SELECT UsrID, UsrName, UsrGen, UsrEmail FROM User " .
            "WHERE UsrRole = ? AND MjrAbrv = ? AND UsrGen = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("sss", $trgtRole, $mjrAbrv, $searchItem);
            break;
        case "admin":
            $query = "SELECT UsrID, UsrName, UsrGen, UsrEmail FROM User " .
            "WHERE UsrRole = ? AND ColgAbrv = ? AND UsrGen = ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("sss", $trgtRole, $colgAbrv, $searchItem);
            break;
    }
} else {
    //检查查询类型
    if ($searchType === "UsrAdms") $searchItem = intval($searchItem);
    //设置查询关键词
    $searchItem = "%" . $searchItem . "%";

    //查询用户信息
    switch ($usrRole) {
        case "tch":
            $query = "SELECT UsrID, UsrName, UsrGen, UsrEmail FROM User " .
            "WHERE UsrRole = ? AND MjrAbrv = ? AND " . $searchType . " LIKE ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("sss", $trgtRole, $mjrAbrv, $searchItem);
            break;
        case "admin":
            if ($searchType === "MjrAbrv")
                $query = "SELECT U.UsrID, U.UsrName, U.UsrGen, U.UsrEmail FROM User AS U " .
                "INNER JOIN Major AS M ON U.MjrAbrv = M.MjrAbrv " .
                "WHERE U.UsrRole = ? AND U.ColgAbrv = ? " .
                "AND U.ColgAbrv = M.ColgAbrv AND M.MjrName LIKE ?;";
            else $query = "SELECT UsrID, UsrName, UsrGen, UsrEmail FROM User " .
            "WHERE UsrRole = ? AND ColgAbrv = ? AND " . $searchType . " LIKE ?";
            $stmt = $db->prepare($query);
            $stmt->bind_param("sss", $trgtRole, $colgAbrv, $searchItem);
            break;
    }
}
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