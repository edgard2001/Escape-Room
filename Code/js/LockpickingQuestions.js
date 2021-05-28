function Random()
                {
                  return Math.floor(Math.random() * 100) + 10;
                }
                                  
                function LowerThanXRandom(x) 
                {
                    do 
                    {
                        var i = Math.floor(Math.random() * 100) + 10;
                    }   
                    while (i > x);
                 return i;
                }
                
                function ClearDivisionRandom(x) 
                {
                    do 
                    {
                        var i = Math.floor(Math.random() * x);
                    }   
                    while ((x % i) != 0);
                 return i;
                }
                
                
                var num1 = Random();
                var num2 = Random();
                var num3 = Random();
                var num4 = LowerThanXRandom(num3);
                var num5 = LowerThanXRandom(13);
                var num6 = LowerThanXRandom(13);
                var num7 = Random();
                var num8 = ClearDivisionRandom(num7);
                
                var q1 = "What is " + num1 + " + " + num2 + "?";
                var q2 = "What is " + num3 + " - " + num4 + "?";
                var q3 = "What is " + num5 + " * " + num6 + "?";
                var q4 = "What is " + num7 + " / " + num8 + "?";
                
                var ans1 = num1 + num2;
                var ans2 = num3 - num4;
                var ans3 = num5 * num6;
                var ans4 = num7 / num8;
                
                document.getElementById("question1").innerHTML = q1;
                document.getElementById("question2").innerHTML = q2;
                document.getElementById("question3").innerHTML = q3;
                document.getElementById("question4").innerHTML = q4;
                
                //document.getElementById("ans1").innerHTML = ans1;
                //document.getElementById("ans2").innerHTML = ans2;
                //document.getElementById("ans3").innerHTML = ans3;
                //document.getElementById("ans4").innerHTML = ans4;