<?php
/*添加课程任务的脚本*/
//获取POST请求的数据
$msName = $_POST["msName"];
$msDesc = $_POST["msDesc"];

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDateTime = date("_YmdHis");

//获取课程ID、用户ID和用户角色
session_start();
$crseID = intval($_SESSION["currCrse"]["CrseID"]);
$usrID = $_SESSION["userInfo"]["UsrID"];
$usrRole = $_SESSION["userInfo"]["UsrRole"];

//检查文件上传错误
if ($_FILES["newMSPkg"]["error"] === 1) {
    echo "<script>alert('超出文件上传大小');</script>";
    exit;
}

if ($_FILES["newMSPkg"]["type"] != "application/x-zip-compressed") {
    echo "<script>alert('上传文件格式错误，请上传zip格式文件');</script>";
    exit;
} else $extName = ".zip";

//将文件移动至指定位置
$trgtPath = $docRoot. "/data/mission/" . $msName . $currDateTime . $extName;

if (is_uploaded_file($_FILES["newMSPkg"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["newMSPkg"]["tmp_name"], $trgtPath)) {
        echo "<script>alert('移动文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

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
    echo "<script>alert('连接数据库失败，请联系管理员并反馈问题');</script>";
    exit;
}

//查询课程内的学生记录
$query = "SELECT * FROM Course WHERE CrseID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $crseID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $stmt->free_result();
    $query = "SELECT UsrID FROM Schedule WHERE CrseID = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $crseID);
    $stmt->execute();
    $result = $stmt->get_result();
    $usrs = $result->fetch_all(MYSQLI_ASSOC);
    // $usrsJSON = json_encode($usrs, JSON_UNESCAPED_UNICODE);
    // file_put_contents("usrs.json", $usrsJSON);

    $pkgPath = "../data/mission/" . $msName . $currDateTime . $extName;
    $query = "INSERT INTO Mission VALUES (NULL, ?, ?, ?, ?, ?)";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ssiss", $msName, $msDesc, $crseID, $usrID, $pkgPath);
    $stmt->execute();

    $query = "SELECT MsID FROM Mission WHERE PkgPath = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("i", $pkgPath);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($msID);
    $stmt->fetch();
    $stmt->free_result();

    for ($indx = 0; $indx < count($usrs); $indx++) {
        $msStat = "incmpl";
        $query = "INSERT INTO Progress VALUES (?, ?, ?, NULL, NULL)";
        $stmt = $db->prepare($query);
        $stmt->bind_param("iss", $msID, $usrs[$indx]["UsrID"], $msStat);
        $stmt->execute();
    }

    echo "<script>alert('成功新增课程任务记录');</script>";
} else {
    echo "<script>alert('查询课程记录失败，请联系管理员并反馈问题');</script>";
    $stmt->free_result();
    $db->close();
    exit;
}

//关闭链接
$db->close();
exit;
?>