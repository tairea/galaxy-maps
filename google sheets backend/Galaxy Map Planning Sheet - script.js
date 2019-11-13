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


function syncBranchAndTopics() {

    /*============================================================
                          index sheet data
    ==============================================================*/

  var branches = [];
  
  //loop to map row data into array data
  for (var i = 0; i < nodeData.length; i++) {
    var nodeType = nodeData[i][0];
    
    switch (nodeType) {
      case "Start":
      case "Branch":
        branches.push({ index: i, topics: [] });
        break;
      case "Topic":
      case "Exam Major":
      case "Project Major":
      case "NZQA Assessment":
      case "Evaluation Major":
        branches[branches.length - 1].topics.push({ index: i, exercises: [] });
        break;
      default:
        var lastBranchIndex = branches.length - 1;
        var lastTopicIndex = branches[lastBranchIndex].topics.length - 1;
        branches[lastBranchIndex].topics[lastTopicIndex].exercises.push({ index: i });
        break;
    }
  }
    
    /*============================================================
                prep data for firestore database
    ==============================================================*/
  
  // Add galaxy document
  firestore.updateDocument("galaxy/tech", { id: 'tech', title: 'Tech' });
  
  
  var nodes = [], edges = [];
  
  // Push branches
  for (var i = 0; i < branches.length; i++) {
    var branchIndex = branches[i].index;
    nodes.push({
      id: nodeData[branchIndex][6],
      group: nodeData[branchIndex][0],
      label: nodeData[branchIndex][1],
      title: nodeData[branchIndex][5],
      dependency: nodeData[branchIndex][9],
    });
    

    if (nodes[i].group == "Start") {
      nodes[i].shape = "circle";
    }

    
    edges.push({
      id: nodeData[branchIndex][7] + "-" + nodeData[branchIndex][6],
      from: nodeData[branchIndex][7],
      to: nodeData[branchIndex][6],
      group: "edge",
    });
    
    // Push topics
    for (var j = 0; j < branches[i].topics.length; j++) {
      var topicIndex = branches[i].topics[j].index;
      var topicNodes = [];
      var topicEdges = [];
      
      // Push exercises into topics
      //TOFIX: some branches dont have topics. so cant push exercise to them.
      for (var k = 0; k < branches[i].topics[j].exercises.length; k++) {
        var exerciseIndex = branches[i].topics[j].exercises[k].index;
        topicNodes.push({
          id: nodeData[exerciseIndex][6],
          group: nodeData[exerciseIndex][0],
          label: nodeData[exerciseIndex][3],
          title: nodeData[exerciseIndex][5],
          dependency: nodeData[exerciseIndex][9]
        });
        
        topicEdges.push({
          id: nodeData[exerciseIndex][7] + "-" + nodeData[exerciseIndex][6],
          from: nodeData[exerciseIndex][7],
          to: nodeData[exerciseIndex][6],
          group: "edge",
        });
      }
      
      nodes.push({
        id: nodeData[topicIndex][6],
        group: nodeData[topicIndex][0],
        label: nodeData[topicIndex][2],
        title: nodeData[topicIndex][5],
        dependency: nodeData[topicIndex][9],
        nodes: topicNodes,
        edges: topicEdges
      });
      
      edges.push({
        id: nodeData[topicIndex][7] + "-" + nodeData[topicIndex][6],
        from: nodeData[topicIndex][7],
        to: nodeData[topicIndex][6],
        group: "edge",
      });
    }
  }
  
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    switch (node.group) {
      case "Start":
      case "Branch":
        firestore.updateDocument("galaxy/tech/nodes/" + node.id, node);
        break;
      case "Topic":
      case "Exam Major":
      case "Project Major":
      case "NZQA Assessment":
      case "Evaluation Major":
        var topicNodes = node.nodes;
        var topicEdges = node.edges;
        firestore.updateDocument("galaxy/tech/nodes/" + node.id, {
          id: node.id,
          group: node.group,
          label: node.label,
          title: node.title,
          dependency: node.dependency
        });
        for (var j = 0; j < topicNodes.length; j++) {
          var topicNode = topicNodes[j];
          firestore.updateDocument("galaxy/tech/nodes/" + node.id + "/nodes/" + topicNode.id, topicNode);
        }
        for (var j = 0; j < topicEdges.length; j++) {
          var topicEdge = topicEdges[j];
          firestore.updateDocument("galaxy/tech/nodes/" + node.id + "/edges/" + topicEdge.id, topicEdge);
        }
        break;
    }
  }
  
  for (var i = 0; i < edges.length; i++) {
    var edge = edges[i];
    firestore.updateDocument("galaxy/tech/edges/" + edge.id, edge);
  }
    
}

function sync() {
  syncBranchAndTopics();
}
