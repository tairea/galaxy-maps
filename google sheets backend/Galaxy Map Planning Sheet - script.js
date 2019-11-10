// tutorial source: https://github.com/grahamearley/FirestoreGoogleAppsScript
// FirestoreApp google script library id: 1VUSl4b1r1eoNcRWotZM3e87ygkxvXltOgyDZhixqncz9lQ3MjfT1iKFw 
// UnderscoreGS google script library id: MiC3qjLYVUjCCUQpMqPPTWUF7jOZt2NQ8

//---- google services credentials
var email = "taiwananaga@tw-galaxy.iam.gserviceaccount.com";
var key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWiMYyk0OEEPds\nqw3qcRBttZrNJtfKqdPn79fX97dSpi6bP400WmPTt67YQOQBbbf59qQ7m1Fr9JUe\nDpA74lGt23M8cNwD7D7OqBqVm771GjeWgOzNqpwYgyW8eVqBsNkoclt4XKc7m/V+\nTAjq2EL39QzbPLuYkYACm72k0LbRUa8B9NOYf3BW/i02VK84AMc+W3bs0HURXY4a\ns64WBh0a9yarBn5KzfTTfZFRokDR6wWQGzk1u8z1ERoP9fSWOGPodvdHZ7R0o56j\nG63w/FzyrjPdXNCTBQfJYcwJj2U7sWNuJn0rgKGr2AQZK458njGX61SxtvjjnJG7\nBLCjOEVxAgMBAAECggEADAFEsK5+SApNri5hmE2SERw+eLMZvuTYpNFOZMQfOr1t\n55DGLWMkKZl3wUYwUXF7ABPbMN1fewkJZyXYJbcObF+BXU/Qyq9npwIlKrC3yNjE\nujlQsa7rDpFthSnNShXusPgP7PZSWArsJpB0AfWZbxgEC3353sRq7g/FAaS5oOY1\nCF4frtZens5giPmQFFbcxMjKLw4aO/zCYogDpGnKvc54/3OkjP/w4nG2Mf/ycHVB\nv5sWDmPsSLficbTmWKlXCk1sVuFFgscfLHv6yLl7dFsmDrMQqJ/4iwWLHhxWkmin\ncRh3D5mitWo8jIV9BspknM6YFZGC6rOwkQcszCQXIQKBgQDrekkUS4nh7F8cxDet\noF9m+E4a4R8rLHg5iaMI2EANBtYtBPgVva/WMmYR5jZzqdS59g8E3Fh1pMCmn6Wt\nS4NzphpJ510Gs4olF7+mkPJ2q8veEig6oOr6p+n9t5WgQD+F+YByrl4KhZgo5hJv\nn7G1mZ64PwVPrF2hxgwDE+YhLQKBgQDpOzkTmuet+sUVnC0Iz/er39dbCF5Q9iNi\ne/S2Ds+Rnn3aeWHxL39X75rHzgXmuUHW63nGsrGpi96uDq2gxDydWvKfBUZzlGE8\n+w+StExvVvGd78xXVBx7ljkoTOUDSiV2NSHRheHKFKOWaVuPdolPJBidFpQ3O1hl\nyPcniNY31QKBgCu5TCKJmDOsGUkVIiWKNsy+5HnXPVtd6YD9jplQ1ivVDiXT22Dm\nFOVX/F3sekXlzgstpkJHy+EkU2VdFX1lHSZ3PEBmxn49DjSvATYjifIBGlzE0FV6\nlccvMKKc2Rqlc2YkGvawa+PWRJeriNbTN0M6IB+kDA9sOQKV7JsRsdSNAoGAGRmb\nieWY21tqjGnTWuhuwhuD5LMg21ux8S5f5pvvcL960eFQThGLhd4ubSRZ9Dupv0R2\nRZEDl7iKzXac7vlPgKvCAqUhsNyeHl7yjRpEQ5M6y4F8H0XZDt/a5OBpoRIAuBj9\nu7vJ0eKovE44YVcjbdX3pChC6TLEz6dyGdobG8UCgYEArUMVYvlrSIWT6KZH+NwQ\nMtx+b900A1sf4DrNC4A49Qze9Fs5HFMcqv+3BK+4lvA3joGWAztpOATb9T4UAqAx\nIljIcvCsOPcf9XlTuwNYIkQO+lvBWJBPXgj80+BY7McFcgeaDNBK5meI4Kvlz5ij\nrnlbBIp4hJTgBs5ok0J7xv4=\n-----END PRIVATE KEY-----\n";
var projectId = "tw-galaxy";

//---- authenticate with firebase
var firestore = FirestoreApp.getFirestore(email, key, projectId);

//---- get the currently active sheet
var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

//---- get total num of rows and columns filled in (minus any table headers)
var [rows, columns] = [sheet.getLastRow() - 3, sheet.getLastColumn()];
  
//---- get sheet range.  (sheet.getRange(row, col, nrow, ncol)
var nodeData = sheet.getRange(4, 2, rows, columns).getValues();

/*

branch
  |--topic
  |  |--resources
  |  |--exercise
  |  |--exercise
  |  |--evaluation
  |--topic
  |  |--resources
  |  |--exercise
  |  |--project minor
  |  |--evaluation
  |--project major
     |--exercise
     |--evaluation

*/

/*

PSEUDOCODE
- loop node types (Col B) into an array
- search this array for all "Branch" nodes, save their index
- loop topic nodes (Col D) and put into an array
- search this array for all non-empty topic nodes, save their index
- loop all exercise nodes (Col E) and put into an array
- search this array for all non-empty exercise nodes, save their index
- use indexs to loop rows and prep data for firestore database
*/

function syncBranchAndTopics() {

    /*============================================================
                          index sheet data
    ==============================================================*/

    var nodeTypes = [];
    var topicNodes = [];
    var exerciseNodes = [];
  
    //loop to map row data into array data
    for (var i = 0; i < nodeData.length; i++) {
        //- loop nodes types into an array
        nodeTypes.push(nodeData[i][0])
        topicNodes.push(nodeData[i][2])
        exerciseNodes.push(nodeData[i][3])
    }
    
    //- get row indexs of branches
    var branchIndices = [];
    var element = "Branch";
    var index = nodeTypes.indexOf(element);
    var i = 0;
    while (index != -1) {
      branchIndices.push(index);
      index = nodeTypes.indexOf(element, index + 1);
    }
    //Logger.log("index of branches: " + branchIndices);
    
    //get row indexs of topics
    var topicIndices = [];
    topicIndices = topicNodes.reduce(function(a, e, i) {
      if (e != 0)
          a.push(i);
      return a;
    }, []);
    //Logger.log("index of topics: " + topicIndices);
    
    //get row indexs of resoures/exercises/
    var exerciseIndices = [];
    exerciseIndices = exerciseNodes.reduce(function(a, e, i) {
      if (e != 0)
          a.push(i);
      return a;
    }, []);
    //Logger.log("index of topics: " + exerciseIndices);
    
    
    /*============================================================
                prep data for firestore database
    ==============================================================*/

    var nodesObj = {}
    nodesObj.nodes = []
    nodesObj.edges = []
    
    //add branches to obj
    for (var i = 0; i < branchIndices.length; i++) {
      var branchNodeId = nodeData[(branchIndices[i])][6]
      nodesObj[branchNodeId] = {
        id: nodeData[(branchIndices[i])][6],
        name: nodeData[(branchIndices[i])][1],
        dependency: nodeData[(branchIndices[i])][9],
      }
      
      //add topics to obj
      for (var j = 0; j < topicIndices.length; j++) {
        //only add topics to matching branch
        //TODO: topics for last branch on sheet now showing. due to branchIndices[i+1].
        if (topicIndices[j] > branchIndices[i] && topicIndices[j] < branchIndices[i+1] ) {
          var topicNodeId = nodeData[(topicIndices[j])][6]
          nodesObj[branchNodeId][topicNodeId] = {
            name: nodeData[(topicIndices[j])][2],
            dependency: nodeData[(topicIndices[j])][9],
            nodes: [],
            edges: []
          };
          //push topic nodes & edges data to galaxy level map
          nodesObj.nodes.push({
            id: nodeData[(topicIndices[j])][6],
            label: nodeData[(topicIndices[j])][3],
            title: nodeData[(topicIndices[j])][5],
            group: nodeData[(topicIndices[j])][0],
          })
          nodesObj.edges.push({
            from: nodeData[(topicIndices[j])][7],
            to: nodeData[(topicIndices[j])][6],
            group: "edge",
          });
          
          //add exercises to obj
          for (var k = 0; k < exerciseIndices.length; k++) {
            if (exerciseIndices[k] > topicIndices[j] && exerciseIndices[k] < topicIndices[j+1] ) {
              var exerciseNodeId = nodeData[(exerciseIndices[k])][6]
              nodesObj[branchNodeId][topicNodeId][exerciseNodeId] = {
                name: nodeData[(exerciseIndices[k])][3],
                dependency: nodeData[(exerciseIndices[k])][9],
              };
              //push exercise nodes & edges data to second level map
              nodesObj[branchNodeId][topicNodeId].nodes.push({
                id: nodeData[(exerciseIndices[k])][6],
                label: nodeData[(exerciseIndices[k])][3],
                title: nodeData[(exerciseIndices[k])][5],
                group: nodeData[(exerciseIndices[k])][0],
              })
              nodesObj[branchNodeId][topicNodeId].edges.push({
                from: nodeData[(exerciseIndices[k])][7],
                to: nodeData[(exerciseIndices[k])][6],
                group: "edge",
              });
            } //end of exercise if
          } //end of exercise loop
         
        } //end of topic if
      } //end of topic loop
        

     } //end of branches loop
    
    
    //Logger.log("loop generated nodesObj: ")
    //Logger.log(nodesObj);
  
    // sync data to firestore database
    firestore.updateDocument("galaxy/tech", nodesObj) 
    //Logger.log("branches added.")
    
}

function createNodesAndEdges() {
    /*============================================================
                prep data for vis.js network graph
    ==============================================================*/
    
    var nodes = [];
    var edges = [];
    
    //1. loop all rows 
    //2. create objs 
    //3. push to arrays
    
    //1.
    for (var x = 0; x < nodeData.length; x++) {

      //2.
      //create nodes
      if (nodeData[x][0] == "Branch") {
        var nodeObj = {
          id: nodeData[x][6],
          label: nodeData[x][1],
          title: nodeData[x][5],
          type: nodeData[x][0],
        }
      } else if (nodeData[x][0] == "Topic" || nodeData[x][0] == "NZQA Assessment" || nodeData[x][0] == "Project Major" || nodeData[x][0] == "Exam Major") {
        var nodeObj = {
          id: nodeData[x][6],
          label: nodeData[x][2],
          title: nodeData[x][5],
          type: nodeData[x][0]
        }
      } else if (nodeData[x][0] == "Resources" || nodeData[x][0] == "Exercise" || nodeData[x][0] == "Project Minor" || nodeData[x][0] == "Exam Minor"|| nodeData[x][0] == "Resource" || nodeData[x][0] == "Evaluation") {
        var nodeObj = {
          id: nodeData[x][6],
          label: nodeData[x][3],
          title: nodeData[x][5],
          type: nodeData[x][0],
          dependency: nodeData[x][9],
          cid: nodeData[x][8],
        }
      }
      nodes.push(nodeObj)
     
      //create edges
      var edgesObj = {
        from: nodeData[x][7],
        to: nodeData[x][6],
        type: "edge",
      }
      edges.push(edgesObj)
          
    } //end of Loop
    
    //3.
    //sync to firestore database
    firestore.updateDocument("galaxy/nodes", nodes) 
    Logger.log("nodes added")
    firestore.updateDocument("galaxy/edges", edges) 
    Logger.log("edges added")
      
}

function sync() {
  syncBranchAndTopics();
  //createNodesAndEdges()
}
