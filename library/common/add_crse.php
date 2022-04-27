<?php
/*添加课程记录的脚本*/
//获取POST请求的数据
$crseName = $_POST["crseName"];
$crseDesc = $_POST["crseDesc"];

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDateTime = date("_YmdHis");

//获取当前用户的ID和角色信息
session_start();
$usrID = $_SESSION["userInfo"]["UsrID"];
$usrName = $_SESSION["userInfo"]["UsrName"];
$usrRole = $_SESSION["userInfo"]["UsrRole"];

//检查文件上传错误
if ($_FILES["crseFrntImg"]["error"] === 1) {
    echo "<script>alert('超出单个文件上传大小');</script>";
    exit;
}

//检查文件类型并设置后置名
$extName = null;
switch ($_FILES["crseFrntImg"]["type"]) {
    case "image/bmp" : $extName = ".bmp"; break;
    case "image/gif" : $extName = ".gif"; break;
    case "image/jpeg": $extName = ".jpg"; break;
    case "image/png" : $extName = ".png"; break;
    default: echo  "<script>alert('您上传的图片格式不符合要求，请上传bmp、gif、jpg或png格式的图片文件');</script>"; exit;
}

//将图片文件移动至指定位置
$trgtPath = $docRoot. "/image/crsefront/" . $crseName . "_" . $usrName . $currDateTime . $extName;

if (is_uploaded_file($_FILES["crseFrntImg"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["crseFrntImg"]["tmp_name"], $trgtPath)) {
        echo "<script>alert('移动课程封面图片文件时发生错误，请联系管理员并反馈问题');</script>";
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

//插入课程信息
$coverPath = "../image/crsefront/" . $crseName . "_" . $usrName . $currDateTime . $extName;
$query = "INSERT INTO Course VALUES (NULL, ?, ?, ?, ?)";
$stmt = $db->prepare($query);
$stmt->bind_param("ssss", $crseName, $crseDesc, $coverPath, $usrID);
$stmt->execute();

echo "<script>alert('成功添加课程');</script>";

//关闭链接
$db->close();
exit;
?>