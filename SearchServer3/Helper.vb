﻿Imports Newtonsoft.Json

Public Class Helper
    Public Shared Function XMLToJSONArray(ByVal XML As System.Xml.XmlNode) As String

    Overloads Shared Function XMLToListofStringDictionary(ByVal XML As System.Xml.XmlDocument, ByVal XPath As String, ByVal Fields As String())
    Overloads Shared Function XMLNodeToStringDictionary(ByVal XML As System.Xml.XmlNode)

End Class