import { Request, Response } from "express";
import * as controller from './TTTController';
import { isUserLoggedIn } from '../user/UserController';
import { ERROR_RESPONSE, OK_RESPONSE } from "../../utils/httpsErrors";

export default [
  {
    path: "/ttt",
    method: "post",
    handler: async (req: Request, res: Response) => {

      let name : string = req.body.name;
      let date : Date = new Date(Date.now());

      res
        .status(200)
        .render("pages/index", {
          user: name,
          date: date
        })
    }
  },
  {
    path: "/ttt/play",
    method: "post",
    handler: async (req: Request, res: Response) => {
      
      // Check if user is logged in.
      if(!isUserLoggedIn(req))
        res.json(ERROR_RESPONSE("You need to log in to be able to play."))
      
      else
        controller.makeMove(req, res);
  
    }
  },
  {
    path: "/ttt/listgames",
    method: "get",
    handler: async (req: Request, res: Response) => {
      controller.listGames(req, res);
    }
  },
  {
    path: "/ttt/getgame",
    method: "get",
    handler: async (req: Request, res: Response) => {
      controller.getGame(req, res);
    }
  },
  {
    path: "/ttt/getscore",
    method: "get",
    handler: async (req: Request, res: Response) => {
      controller.getScore(req, res);
    }
  },
  {
    path: "/ttt/creategame",
    method: "post",
    handler: async (req: Request, res: Response) => {
      if(controller.createNewGame(req)){
        res.json(OK_RESPONSE("Game created successfully"));
      }
      else{
        res.json(ERROR_RESPONSE("Unable to create game."));
      }
    }
  }
]