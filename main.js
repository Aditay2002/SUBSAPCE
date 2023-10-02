const express=require('express');
const axios=require('axios');
const {_}=require('lodash');

const app=express();

app.use(express.json());

const PORT= 4000;
// https://intent-kit-16.hasura.app/api/rest/blogs
// data retriving && data analyisis
app.get('/api/blog-stats', async (req, res) => {
    try {
      const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: {
            'x-hasura-admin-secret':'32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'// You can add additional custom headers here
        }
      });
      const arr=_.chunk(response.data.blogs,1);
     
  
//  Longest title
     const blogt = _.map(response.data.blogs, (blog) => blog.title);

     const longestTitle = _.maxBy(blogt, (title) => title.length);

    
    //  No of blogs containing word "Privacy"
    var c=0;
     const privacy=_.map(blogt,(blog)=>{ if(blog.includes("Privacy"))
     {
     c++;
     }});


// Unique Blog array
const unique=[...new Set(blogt)];

const obj={
  "Total number of blogs":`${_.size(arr)}`,
  "The title of the longest blog":`${longestTitle}`,
  " Number of blogs with 'privacy' in the title":`${c}`,
  "Unique blog titles":`[${unique}]`
}
    res.json(obj);

    
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'there is some error on the server side' });
    }
  });

  
  // SEARCHING
  app.get('/api/blog-search',async(req,res) =>{
    try {
      const sr=req.query.query;

     
      if(!sr){
        res.json('Pease select proper Query')
      }
      const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: {
            'x-hasura-admin-secret':'32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'// You can add additional custom headers here
        }
      });
      
      if(response.data.blogs){
       const prq=response.data.blogs.filter((blog) =>
       blog.title.includes(sr)
     );
      
     if(prq.length===0){
      res.json({message:'No such content found'})
     }
      res.json(prq);
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Some error in searching algorithm' });
    }
  })
app.listen(PORT,()=>{
    console.log(`Listeing at ${PORT}`)
})